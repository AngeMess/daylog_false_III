import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useFonts, Montserrat_700Bold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_500Medium,
  });
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#141718" />
        {/* Fondo decorativo con la imagen LoginLines */}
        <View style={styles.backgroundLinesWrapper} pointerEvents="none">
          <Image
            source={require('../../assets/LoginLines.png')}
            style={styles.backgroundLines}
            resizeMode="cover"
          />
        </View>
        {/* Contenido principal centrado más abajo */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.mainContent}
        >
          {/* Logo section */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>DayLog</Text>
            <Image
              source={require('../../assets/CuscaWhiteLogoLogin.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Inicia sesión</Text>
            <Text style={styles.subHeaderText}>en tu cuenta</Text>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="CuscaID"
                placeholderTextColor="#C2C3CB"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#C2C3CB"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              >
                <MaterialIcons
                  name={passwordVisible ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="#C2C3CB"
                />
              </TouchableOpacity>
            </View>
            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('TabNavigatorPortfolio')}>
              <Text style={styles.loginButtonText}>Entrar como Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.loginButton, {marginTop: 10, backgroundColor: '#FFD600'}]} onPress={() => navigation.navigate('TabNavigatorSupervisor')}>
              <Text style={[styles.loginButtonText, {color: '#232627'}]}>Entrar como Supervisor</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {/* Bottom Logo */}
        <View style={styles.bottomLogoContainer} pointerEvents="none">
          <Image
            source={require('../../assets/CuscaYellowLogoLogin.png')}
            style={styles.bottomLogo}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141718',
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLinesWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backgroundLines: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 80,
    zIndex: 2,
  },
  logoContainer: {
    marginTop: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
    marginBottom: 24,
  },
  logoText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
    zIndex: 2,
    width: '100%',
    maxWidth: 400,
  },
  headerText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 28,
    color: 'white',
    fontWeight: '500',
    marginBottom: 0,
    textAlign: 'left',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#C2C3CB',
    marginBottom: 40,
    marginTop: 4,
    textAlign: 'left',
    fontWeight: '500',
    fontFamily: 'Montserrat_500Medium',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    backgroundColor: '#232627',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#C2C3CB',
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
  },
  loginButton: {
    backgroundColor: '#1B1E20',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat_500Medium',
  },
  bottomLogoContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 180,
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 3,
  },
  bottomLogo: {
    width: 180,
    height: 180,
  },
});

export default LoginScreen; 