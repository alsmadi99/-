import React, {useState} from 'react';
import {SafeAreaView, View, Text, Image, StyleSheet} from 'react-native';
import CustomButton from '../components/CustomButton';
// Adjust the import path as needed
const OnboardingFlow: React.FC = ({navigation}: any) => {
  const [step, setStep] = useState(1); // 1 = first screen, 2 = second screen

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // navigate to Login or trigger a prop callback
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === 1 ? (
        // === Screen 1 ===
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
        // === Screen 2 ===
        <>
          <View style={styles.imageGridContainer}>
            <View style={styles.imageRow}>
              <Image
                source={require('../assets/Maskgroup2.png')}
                style={styles.gridImage1}
              />

              <Image
                source={require('../assets/Maskgroup1.png')}
                style={styles.gridImage2}
              />
            </View>
            <View style={styles.imageRow}>
              <Image
                source={require('../assets/Maskgroup4.png')}
                style={styles.gridImage3}
              />

              <Image
                source={require('../assets/Maskgroup3.png')}
                style={styles.gridImage4}
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>يمكنك رفع كل منتجاتك</Text>
            <Text style={styles.text}>بيسر و سهولة عبر هذا التطبيق</Text>
          </View>
        </>
      )}

      {/* Buttons + Dots */}
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
  gridImage1: {width: '48%', height: 250, borderRadius: 10},
  gridImage2: {width: '48%', height: 160, borderRadius: 10},
  gridImage3: {width: '48%', height: 160, borderRadius: 10},
  gridImage4: {
    width: '48%',
    height: 250,
    borderRadius: 10,
    position: 'absolute',
    bottom: 7,
    right: 0,
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
