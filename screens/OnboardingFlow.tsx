import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CustomButton from '../components/CustomButton';

const OnboardingFlow: React.FC = ({navigation}: any) => {
  const [step, setStep] = useState(1); // 1 = first screen, 2 = second screen

  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 60) / 2; // 20 margin left, 20 right, 10 gap between images

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === 1 ? (
        <>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/Asset2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.textStyle}>هذا التطبيق</Text>
          <Text style={styles.textStyle}>معد لأصحاب المتاجر</Text>
        </>
      ) : (
        <>
          <View style={styles.imageGridContainer}>
            <View style={styles.imageRow}>
              <Image
                source={require('../assets/Maskgroup2.png')}
                style={[
                  styles.gridImage,
                  {width: imageSize, height: imageSize * 2},
                ]}
              />
              <Image
                source={require('../assets/Maskgroup1.png')}
                style={[
                  styles.gridImage,
                  {width: imageSize, height: imageSize * 1.6},
                ]}
              />
            </View>
            <View style={styles.imageRow}>
              <Image
                source={require('../assets/Maskgroup4.png')}
                style={[
                  styles.gridImage,
                  {width: imageSize, height: imageSize * 1},
                ]}
              />
              <Image
                source={require('../assets/Maskgroup3.png')}
                style={[
                  styles.gridImage,
                  {width: imageSize, height: imageSize * 1.5},
                ]}
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>يمكنك رفع كل منتجاتك</Text>
            <Text style={styles.text}>بيسر و سهولة عبر هذا التطبيق</Text>
          </View>
        </>
      )}

      <View style={styles.buttonContainer}>
        <CustomButton type="PRIMARY" onPress={handleNext} text="التالي" />
        <View style={styles.dots}>
          <View style={[styles.dot, step === 1 ? styles.activeDot : null]} />
          <View style={[styles.dot, step === 2 ? styles.activeDot : null]} />
        </View>
        <CustomButton
          onPress={() => navigation.navigate('Login')}
          type="TERTIARY"
          text="تخطي"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '65%',
  },
  logo: {
    width: '100%',
    height: '85%',
    marginBottom: 10,
  },
  textStyle: {fontSize: 20, fontWeight: 'bold', textAlign: 'center'},
  imageGridContainer: {marginTop: 20, marginHorizontal: 20},
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridImage: {
    borderRadius: 10,
    backgroundColor: '#fff', // Optional fallback if image not loaded
  },
  textContainer: {alignItems: 'center'},
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {alignItems: 'center', paddingTop: 15},
  dots: {flexDirection: 'row', justifyContent: 'center', marginVertical: 15},
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00cfff',
    marginHorizontal: 5,
  },
  activeDot: {backgroundColor: '#d3d3d3'},
});

export default OnboardingFlow;
