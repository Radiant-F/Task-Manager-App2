import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Background, Gap} from '../components';
import CheckBox from '@react-native-community/checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

export default function SignIn({navigation}) {
  const [securePassword, setSecurePassword] = useState(true);
  const [rememberUser, setRememberUser] = useState(false);
  const [loading, setLoading] = useState(false);

  // form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submitSignIn() {
    setLoading(true);
    try {
      const {data} = await axios.post(
        'https://todoapi-production-61ef.up.railway.app/api/v1/auth/login',
        {email, password},
        {headers: {'Content-Type': 'application/json'}},
      );
      setLoading(false);
      rememberUser &&
        EncryptedStorage.setItem(
          'user_credential',
          JSON.stringify({email, password}),
        );
      navigation.replace('Home', {token: data.user.token});
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      console.log(error.response.data);
    }
  }

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.viewContainer}>
        <Text style={styles.textTitle}>Sign In</Text>

        <Gap height={15} />

        <View style={styles.viewSignIn}>
          {/* Input Email */}
          <Text style={styles.textInputTitle}>Email</Text>
          <View style={styles.viewInput}>
            <Icon name={'gmail'} color={'black'} size={23} />
            <TextInput
              placeholder="contoh@email.com"
              placeholderTextColor={'grey'}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              onChangeText={setEmail}
            />
          </View>

          <Gap height={20} />

          {/* Input Password */}
          <Text style={styles.textInputTitle}>Password</Text>
          <View style={styles.viewInput}>
            <Icon name={'lock'} color={'black'} size={23} />
            <TextInput
              placeholder="Kata sandi.."
              placeholderTextColor={'grey'}
              style={styles.input}
              secureTextEntry={securePassword}
              autoCapitalize="none"
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecurePassword(!securePassword)}>
              <Icon
                name={securePassword ? 'eye-off' : 'eye'}
                color={'black'}
                size={23}
              />
            </TouchableOpacity>
          </View>

          {/* CheckBox Remember Me */}
          <View style={styles.viewRememberMe}>
            <CheckBox
              tintColors={{false: 'white', true: 'white'}}
              value={rememberUser}
              onValueChange={() => setRememberUser(!rememberUser)}
            />
            <Text
              style={styles.plainText}
              onPress={() => setRememberUser(!rememberUser)}>
              Ingat Saya
            </Text>
          </View>

          <Gap height={20} />

          {/* Submit & Register Buttons */}
          <TouchableNativeFeedback useForeground onPress={submitSignIn}>
            <View style={styles.btnSubmit}>
              {loading ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <Text style={styles.textBtnTitle}>Masuk</Text>
              )}
            </View>
          </TouchableNativeFeedback>
          <Gap height={10} />
          <TouchableNativeFeedback
            useForeground
            onPress={() => navigation.navigate('SignUp')}>
            <View
              style={{
                ...styles.btnSubmit,
                backgroundColor: '#9A4242',
                width: 150,
              }}>
              <Text style={styles.textBtnTitle}>Daftar</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBtnTitle: {
    color: 'white',
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
  },
  btnSubmit: {
    height: 45,
    width: 230,
    backgroundColor: '#00677E',
    borderRadius: 45 / 2,
    elevation: 3,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  plainText: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  viewRememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'black',
  },
  textInputTitle: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
    marginBottom: 5,
  },
  viewInput: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
    borderRadius: 50 / 2,
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5,
  },
  viewSignIn: {
    backgroundColor: '#ffffff4d',
    width: '95%',
    borderRadius: 20,
    padding: 30,
  },
  textTitle: {
    color: 'white',
    fontSize: 27,
    fontFamily: 'HelveticaNeue-Heavy',
  },
  viewContainer: {
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
});
