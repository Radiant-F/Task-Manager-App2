import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Background} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

export default function SplashScreen({navigation}) {
  async function refreshToken() {
    try {
      const value = await EncryptedStorage.getItem('user_credential');
      const {data} = await axios.post(
        'https://todoapi-production-61ef.up.railway.app/api/v1/auth/login',
        JSON.parse(value),
        {headers: {'Content-Type': 'application/json'}},
      );
      navigation.replace('Home', {token: data.user.token});
    } catch (error) {
      console.log(error);
      navigation.replace('SignIn');
    }
  }

  useEffect(() => {
    refreshToken();
  }, []);

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
