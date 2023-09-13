import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Background} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function SplashScreen({navigation}) {
  useEffect(() => {
    EncryptedStorage.getItem('user_credential', value => {
      const credential = JSON.parse(value);
      if (credential) {
        fetch(
          'https://todoapi-production-61ef.up.railway.app/api/v1/auth/login',
          {
            method: 'POST',
            body: value,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(response => response.json())
          .then(json => {
            if (json.status == 'success') {
              navigation.replace('Home', {token: json.user.token});
            } else {
              console.log(json);
              navigation.replace('SignIn');
            }
          })
          .catch(error => {
            console.log(error);
            navigation.replace('SignIn');
          });
      } else {
        setTimeout(() => {
          navigation.replace('SignIn');
        }, 3000);
      }
    });
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
