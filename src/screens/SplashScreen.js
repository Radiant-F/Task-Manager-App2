import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Background} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {SetToken, SetUsername} from '../redux/slice/userSlice';
import {useDispatch} from 'react-redux';

export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();
  const instance = axios.create({
    baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async function refreshToken() {
    try {
      const value = await EncryptedStorage.getItem('user_credential');
      const responseLogin = await instance.post(
        '/auth/login',
        JSON.parse(value),
      );
      const token = responseLogin.data.user.token;
      dispatch(SetToken(token));
      const responseUserData = await instance.get('/profile', {
        headers: {Authorization: `Bearer ${token}`},
      });
      const username = responseUserData.data.user.username;
      dispatch(SetUsername(username));
      navigation.replace('Home');
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
