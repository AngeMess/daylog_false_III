import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/Loading_Color_Cusca.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141718',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
  },
}); 