import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function UserData({token, navigation}) {
  const [userData, setUserData] = useState({
    username: 'User Name',
    avatar: {
      url: '',
    },
  });

  function getUser() {
    fetch('https://todoapi-production-61ef.up.railway.app/api/v1/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          setUserData({...userData, ...json.user});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  useEffect(() => {
    getUser();
  }, []);

  function confirmSignOut() {
    Alert.alert('Keluar?', 'Sesi Anda akan berakhir.', [
      {
        text: 'Batal',
      },
      {
        text: 'Keluar',
        onPress: () => {
          EncryptedStorage.removeItem('user_credential')
            .then(() => {
              navigation.replace('SignIn');
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
  }

  return (
    <TouchableNativeFeedback onPress={confirmSignOut}>
      <View style={styles.viewProfile}>
        <View>
          <Text style={styles.textDefault}>Hi,</Text>
          <Text style={styles.textUserName}>{userData.username}</Text>
        </View>
        {userData.avatar.url == '' ? (
          <Icon name="account-circle" color="white" size={50} />
        ) : (
          <Image
            source={{uri: userData.avatar.url}}
            style={styles.imgProfile}
          />
        )}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  textUserName: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Heavy',
    fontSize: 20,
  },
  textDefault: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  viewProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20 + StatusBar.currentHeight,
    marginHorizontal: 30,
    alignItems: 'center',
  },
});
