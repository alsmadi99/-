import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App'; // Adjust the import path as necessary

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  I18nManager,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

import LinearGradient from 'react-native-linear-gradient';
import {login} from '../lib/api';
// Force RTL layout if not already set
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState(__DEV__ ? 'brobrhooom1' : '');
  const [password, setPassword] = useState(
    __DEV__ ? '%23QHXIDO2nQv8GijeO8' : '',
  );

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      console.log('Parsed response:', res);

      if (res.token) {
        console.log('Login success!');
        await AsyncStorage.setItem('user', JSON.stringify(res));
        navigation.navigate('Home');
      } else {
        console.log('Login failed:', res.message || 'No token in response');
        Alert.alert('خطأ في تسجيل الدخول', res.message || 'حدث خطأ غير متوقع');
      }
    } catch (error: any) {
      // Network or unexpected error
      console.error('Raw fetch error:', error);
      Alert.alert('خطأ في تسجيل الدخول', 'تعذر الاتصال بالخادم');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Group.png')} // Replace with your background image
      style={styles.background}
      resizeMode="cover">
      <LinearGradient
        colors={['#19C7D8', '#139097']} // Use alpha for opacity
        locations={[0.57, 0.86]}
        style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Logo + App Name */}
            <View style={styles.header}>
              <Image
                source={require('../assets/Layer_1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Image
                source={require('../assets/textimage.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Login Box */}
            <View style={styles.loginBox}>
              <TextInput
                placeholder="اسم المستخدم"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                placeholder="كلمة المرور"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>نسيت كلمة المرور</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}>
                <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 220,
    height: 80,
  },
  appNameArabic: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#000',
  },
  appNameEnglish: {
    fontSize: 45,
    color: '#000',
    letterSpacing: 2,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 40,
    color: '#000',
    marginBottom: 20,
  },
  loginBox: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  forgotPassword: {
    color: '#00BCD4',
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  loginButton: {
    backgroundColor: '#00BCD4',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LoginScreen;
