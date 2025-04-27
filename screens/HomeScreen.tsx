import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Switch,
  Alert,
} from 'react-native';
import ImagePickerComponent from '../components/ImagePickerComponent';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from '../components/icon';
import {Buffer} from 'buffer';
import {createProduct} from '../lib/api'; // adjust path if needed

global.Buffer = global.Buffer || Buffer;

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const [mainImage, setMainImage] = useState<any>(null);
  const [extraImages, setExtraImages] = useState<any[]>([
    null,
    null,
    null,
    null,
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{label: 'Simple', value: 'simple'}]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [limitedQuantity, setLimitedQuantity] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if (!name || !price || !items || !description || !mainImage) {
      Alert.alert('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }
    try {
      await createProduct({
        name,
        price,
        description,
        items,
        limitedQuantity,
        showProducts,
        mainImage,
      });
      Alert.alert('تم حفظ المنتج بنجاح!');
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('فشل الحفظ على السيرفر. تحقق من الاتصال أو البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <KeyboardAvoidingView
        contentContainerStyle={styles.container}
        style={{flex: 1, width: '100%'}}>
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
          {extraImages.map((img, i) => {
            return (
              <ImagePickerComponent
                extraStyle={styles.box}
                imageExtraStyle={{width: '100%', height: '100%'}}
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
            );
          })}
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
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#ccc',
          }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="اختر فئة المنتج"
            style={{
              borderColor: '#ccc',
            }}
            dropDownContainerStyle={{
              borderColor: '#ccc',
            }}
            placeholderStyle={{
              textAlign: 'center', // ✅ placeholder center
            }}
            listItemLabelStyle={{
              textAlign: 'center',
            }}
            labelStyle={{
              textAlign: 'center', // ✅ Fix: Selected value stays centered
            }}
          />
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

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}>
          <Text style={styles.saveText}>
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    marginVertical: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  picker: {
    width: '100%',
    textAlign: 'center', // Center inside picker (iOS)
  },

  pickerItem: {
    textAlign: 'center', // Center each item text (iOS)
    fontSize: 16,
  },

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
    width: '23%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden', // <-- Important to crop inside nicely
  },
  MainImage: {width: '100%', marginVertical: 10},
  container: {padding: 16, backgroundColor: '#fff'},
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 5,
    width: '100%',
    height: 100,
    marginVertical: 10,
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
