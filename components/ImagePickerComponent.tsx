import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Text,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from './icon';
type Props = {
  image: any;
  onPick: (asset: any) => void;
  extraStyle?: object;
  imageExtraStyle?: object;
  text?: string;
  customIcon?: React.ReactNode;
};

const ImagePickerComponent: React.FC<Props> = ({
  image,
  onPick,
  extraStyle,
  imageExtraStyle,
  text,
  customIcon,
}) => {
  const handleSelectImage = () => {
    Alert.alert('اختر المصدر', 'من أين تريد تحميل الصورة؟', [
      {
        text: 'الكاميرا',
        onPress: async () => {
          const result = await launchCamera({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.[0]) {
            onPick(result.assets[0]);
          }
        },
      },
      {
        text: 'المعرض',
        onPress: async () => {
          const result = await launchImageLibrary({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.[0]) {
            onPick(result.assets[0]);
          }
        },
      },
      {text: 'إلغاء', style: 'cancel'},
    ]);
  };

  return (
    <View style={[{width: '100%'}, extraStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        onPress={handleSelectImage}>
        {image?.uri ? (
          <Image
            source={{uri: image.uri}}
            style={[styles.image, imageExtraStyle]}
            resizeMode="cover"
          />
        ) : (
          <>
            {customIcon ? (
              customIcon
            ) : (
              <Icon type="ant" name="pluscircleo" color="black" size={20} />
            )}
            {text && <Text>{text}</Text>}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ImagePickerComponent;
