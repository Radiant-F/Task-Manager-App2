import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';

export default function UserData({navigation}) {
  const {username} = useSelector(state => state.user);

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
          <Text style={styles.textUserName}>{username}</Text>
        </View>
        <Icon name="account-circle" color="white" size={50} />
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
