import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Button,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  BackHandler,
  Platform,
  Dimensions,
} from 'react-native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import * as LocalAuthentication from 'expo-local-authentication';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const { portrait, landscape } = useDeviceOrientation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const onPressLearnMore = () => {
    alert('Learn More Pressed', Dimensions.get('screen'));
  };

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
      return alertComponent(
        'Please enter your password',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth()
      );

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Biometric not registered',
        'Please login with your password',
        'OK',
        () => fallBackToDefaultAuth()
      );

    //  promptMessage?: string;
    // cancelLabel?: string;
    // disableDeviceFallback?: boolean;
    // fallbackLabel ?: string;

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)
    let promptMessage;
    supportedBiometrics === 1
      ? (promptMessage = 'Please touch sensor when ready')
      : 'Use face recognition';

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    // Log the user in on success
    if (biometricAuth) console.log('success');

    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          {/* <Text
            accessibilityLabel="Welcome note"
            numberOfLines={1}
            onLongPress={() => alert('Text pressed')}
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde
            perspiciatis nobis non voluptatibus tenetur fuga magni accusamus.
            Atque minima laboriosam
          </Text>
          <TouchableOpacity onPress={() => alert('Image pressed')}>
            <Image
              resizeMode="contain"
              loadingIndicatorSource={require('./assets/adaptive-icon.png')}
              fadeDuration={1299}
              source={{
                width: 200,
                height: 200,
                uri: 'https://picsum.photos/200',
              }}
            />
          </TouchableOpacity>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => alert('Image pressed')}
          >
            <Image
              resizeMode="contain"
              loadingIndicatorSource={require('./assets/adaptive-icon.png')}
              fadeDuration={1299}
              source={{
                width: 200,
                height: 200,
                uri: 'https://picsum.photos/200',
              }}
            />
          </TouchableHighlight>
          <TextInput style={styles.textInput} placeholder="Type here" />
          <Button
            onPress={onPressLearnMore}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            title="Press me"
            onPress={() =>
              Alert.alert('Simple Button pressed', 'Hello', [
                {
                  text: 'Cancel',
                },
                {
                  text: 'OK',
                  onPress: () => BackHandler.exitApp(),
                },
              ])
            }
          />
          <Text>ipsum dolor, sit amet consectetu</Text>
          <View
            style={{ backgroundColor: 'dodgerblue', width: '50%', height: 70 }}
          ></View> */}
          <Button
            title="Login with Biometrics"
            color="#000"
            onPress={handleBiometricAuth}
          />
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {},
});
