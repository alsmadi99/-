import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import ImagePickerComponent from '../components/ImagePickerComponent';
import {Picker} from '@react-native-picker/picker';
import Icon from '../components/icon';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || Buffer;

const uploadImage = async (imageAsset: any): Promise<string> => {
  // const uri = imageAsset.uri;
  // const filename = imageAsset.fileName || uri.split('/').pop();
  // const type = imageAsset.type || 'image/jpeg';
  console.log('imageAsset', imageAsset);

  const formData = new FormData();
  formData.append('file', {
    uri: imageAsset.uri,
    name: imageAsset.fileName || 'photo.jpg',
    type: imageAsset.type || 'image/jpeg',
  });

  try {
    const res = await fetch(
      'https://mqj.auj.mybluehost.me/harir/wp-json/wp/v2/media',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21xai5hdWoubXlibHVlaG9zdC5tZS9oYXJpciIsImlhdCI6MTc0NTI1NzQ1MSwibmJmIjoxNzQ1MjU3NDUxLCJleHAiOjE3NDU4NjIyNTEsImRhdGEiOnsidXNlciI6eyJpZCI6IjIifX19.kS9a2cSZf_22XrCBgxVQqz6mW5FRbQPXS-v7iVfjpnU',
        },
        body: formData,
      },
    );
    const json = await res.json();
    console.log('Upload response:', json);

    if (!res.ok) {
      throw new Error(json.message || 'Upload failed');
    }

    return json.source_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
//     const text = await res.text();
//     console.log('Upload response:', text);
//     // console.log('Upload response:', json);
//     // if (!res.ok) {
//     //   console.log('Upload error response:', json);
//     //   throw new Error('Upload failed');
//     // }

//     // console.log('Image uploaded:', json.source_url);
//     // return json.source_url;
//     return '';
//   } catch (error) {
//     console.error('Upload failed:', error);
//     throw error;
//   }
// };

const HomeScreen = () => {
  const [mainImage, setMainImage] = useState<any>(null);
  const [extraImages, setExtraImages] = useState<any[]>([
    null,
    null,
    null,
    null,
  ]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [limitedQuantity, setLimitedQuantity] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const handleSave = async () => {
    try {
      let imageUrl = '';
      if (mainImage?.uri) {
        imageUrl = await uploadImage(mainImage);
      }

      console.log('Main image URL:', imageUrl);
      const product = {
        name,
        type: 'simple',
        regular_price: price,
        description,
        categories: [{name: category}],
        manage_stock: limitedQuantity,
        status: showProducts ? 'publish' : 'draft',
        images: imageUrl ? [{src: imageUrl}] : [],
      };

      //  const consumerKey = 'YOUR_CONSUMER_KEY';
      // const consumerSecret = 'YOUR_CONSUMER_SECRET';
      const apiUrl = `https://mqj.auj.mybluehost.me/harir/wp-json/wc/v3/products`;

      // const credentials = Buffer.from(
      //   `${consumerKey}:${consumerSecret}`,
      // ).toString('base64');

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21xai5hdWoubXlibHVlaG9zdC5tZS9oYXJpciIsImlhdCI6MTc0NDc5Mzg1NiwibmJmIjoxNzQ0NzkzODU2LCJleHAiOjE3NDUzOTg2NTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjIifX19.Yz1xM21QP2DcJmXj8Z1jhkFxlR5psGoDyo8_9t8ZZxg`,
          },
          body: JSON.stringify(product),
        });
        const res = await fetch(
          'https://mqj.auj.mybluehost.me/harir/wp-json/wc/v3/products',
          {
            headers: {
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21xai5hdWoubXlibHVlaG9zdC5tZS9oYXJpciIsImlhdCI6MTc0NDc5Mzg1NiwibmJmIjoxNzQ0NzkzODU2LCJleHAiOjE3NDUzOTg2NTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjIifX19.Yz1xM21QP2DcJmXj8Z1jhkFxlR5psGoDyo8_9t8ZZxg`,
            },
          },
        );
        const data = await res.json();
        console.log(data);

        const resText = await response.text(); // <-- get raw response
        if (!response.ok) {
          console.log('Raw response:', resText);
          throw new Error(`Server responded with ${response.status}`);
        }

        const resData = JSON.parse(resText);
        console.log('Product created:', resData);
        Alert.alert('تم حفظ المنتج بنجاح!');
      } catch (err: any) {
        console.error('API error:', err.message || err);
        Alert.alert('فشل الحفظ على السيرفر. تحقق من الاتصال أو البيانات.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('فشل تحميل الصورة. تحقق من الاتصال أو البيانات.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Main Image */}
      <View style={{paddingVertical: 20, paddingHorizontal: 15}}>
        <ImagePickerComponent
          text="إضافة صورة أو فيديو"
          image={mainImage}
          onPick={setMainImage}
          extraStyle={styles.mainBox}
          customIcon={
            <Icon type="ant" name="pluscircleo" color="white" size={30} />
          }
        />
      </View>

      {/* Extra Images */}
      <View style={styles.imageRow}>
        {extraImages.map((img, i) => (
          <ImagePickerComponent
            extraStyle={styles.box}
            key={i}
            image={img}
            customIcon={
              <Icon type="ant" name="pluscircleo" color="black" size={20} />
            }
            onPick={asset => {
              const newImages = [...extraImages];
              newImages[i] = asset;
              setExtraImages(newImages);
            }}
          />
        ))}
      </View>

      {/* Text Inputs */}
      <TextInput
        placeholder="ادخل اسم المنتج"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <Text style={styles.currency}>JOD</Text>
        <TextInput
          placeholder="ادخل السعر"
          style={[styles.input, {flex: 1}]}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ccc',
        }}>
        <Picker
          placeholder="أضف فئة المنتج"
          selectedValue={category}
          onValueChange={itemValue => setCategory(itemValue)}>
          <Picker.Item label="simple" />
        </Picker>
      </View>
      <TextInput
        placeholder="أضف وصف المنتج"
        style={[styles.input, {height: 80}]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={{position: 'absolute', right: 55}}>عرض المنتج</Text>
        <Switch value={showProducts} onValueChange={setShowProducts} />
        <Text style={{position: 'absolute', left: 55}}>كمية محدودة</Text>
        <Switch value={limitedQuantity} onValueChange={setLimitedQuantity} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>حفظ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainBox: {
    backgroundColor: '#00BCD4',
    width: '100%',
    height: 170,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  box: {
    backgroundColor: '#f2f2f2',
    width: '20%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  MainImage: {width: '100%', marginVertical: 10},
  container: {padding: 16, backgroundColor: '#fff'},
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  currency: {marginRight: 10, fontSize: 18, position: 'absolute', right: 0},
  switchRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: '#00BCD4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveText: {color: '#fff', fontSize: 18},
  offlineTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 20},
  offlineItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retryBtn: {paddingHorizontal: 10, paddingVertical: 5},
  retryText: {color: '#00BCD4'},
});

export default HomeScreen;
