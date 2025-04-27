import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mqj.auj.mybluehost.me/harir/wp-json';
///////////////////////////
///////////////////////////

export default function buildUrlWithQueryParams(
  apiUrl: string,
  queryParams: any,
) {
  if (!queryParams) {
    return '';
  }

  const queryString = Object.keys(queryParams)
    .map(key => `${key}=${queryParams[key] == null ? '' : queryParams[key]}`)
    .join('&');

  return `${apiUrl}?${queryString}`;
}

const customFetch = async (url: string, options: RequestInit, retry = true) => {
  const storedCookie = await AsyncStorage.getItem('humans_cookie');

  // 🛠️ Only try to get user token if NOT login URL
  let token: string | null = null;
  if (!url.includes('/jwt-auth/v1/token')) {
    const user = await AsyncStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    token = userData?.token;

    if (!token) {
      console.error('No token found in AsyncStorage');
      return null;
    }
  }

  // 🛠️ Build headers
  const headers: any = {
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    ...(storedCookie ? {Cookie: storedCookie} : {}),
    ...(token ? {Authorization: `Bearer ${token}`} : {}), // 🛠️ Only attach Authorization if token exists
  };

  if (options.headers) {
    options.headers = {
      ...headers,
      ...options.headers,
    };
  } else {
    options.headers = headers;
  }

  const response = await fetch(url, options);
  const text = await response.text();

  console.log('Request Data:', {
    url,
    method: options.method,
    headers: options.headers,
    body: options.body,
  });

  // Detect the <script> pattern
  if (response.status === 409 && text.includes('document.cookie = "humans_')) {
    const match = text.match(/document\.cookie = "(humans_\d+=1)"/);
    if (match && match[1]) {
      const cookie = match[1];

      await AsyncStorage.setItem('humans_cookie', cookie);

      if (retry) {
        return customFetch(url, options, false);
      }
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const login = async (username: string, password: string) => {
  const apiUrl = BASE_URL + '/jwt-auth/v1/token';
  const params = {
    username,
    password,
  };
  const urlWithParams = buildUrlWithQueryParams(apiUrl, params);
  const data = await customFetch(urlWithParams, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Response data:', data); // Debugging line

  return data;
};

export const uploadMedia = async (imageAsset: any) => {
  console.log('imageAsset', imageAsset);

  const formData = new FormData();
  formData.append('file', {
    uri: imageAsset.uri,
    name: imageAsset.fileName || 'photo.jpg',
    type: imageAsset.type || 'image/jpeg',
  });

  try {
    const res = await customFetch(BASE_URL + '/wp/v2/media', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', res);

    if (!res || (res && res.message)) {
      throw new Error(res?.message || 'Upload failed');
    }

    return res.source_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const createProduct = async ({
  name,
  price,
  description,
  items,
  limitedQuantity,
  showProducts,
  mainImage,
}: {
  name: string;
  price: string;
  description: string;
  items: object;
  limitedQuantity: boolean;
  showProducts: boolean;
  mainImage?: {uri: string; fileName?: string; type?: string};
}) => {
  try {
    let imageUrl = '';

    if (mainImage?.uri) {
      imageUrl = await uploadMedia(mainImage);
    }

    const product = {
      name,
      type: 'simple',
      regular_price: price,
      description,
      items: [{name: items}],
      manage_stock: limitedQuantity,
      status: showProducts ? 'publish' : 'draft',
      images: imageUrl ? [{src: imageUrl}] : [],
    };

    const res = await customFetch(`${BASE_URL}/wc/v3/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });

    console.log('Product created:', res);

    if (!res || res.message) {
      throw new Error(res?.message || 'Failed to create product.');
    }

    return res;
  } catch (error: any) {
    console.error('Create product error:', error.message || error);
    throw error;
  }
};
