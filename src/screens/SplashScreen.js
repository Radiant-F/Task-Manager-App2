import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Background} from '../components';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Background />
      <Image
        source={require('../assets/images/app_logo.png')}
        style={styles.imgLogo}
      />
      <Text style={styles.textVersion}>v0.0.1-alpha-rc</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textVersion: {
    color: 'white',
    fontFamily: 'HelveticaNeue-MediumExt',
    position: 'absolute',
    bottom: 5,
    fontSize: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLogo: {
    width: 120,
    height: 120,
  },
});
