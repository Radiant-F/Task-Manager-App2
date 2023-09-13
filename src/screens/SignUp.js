import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Background, Gap} from '../components';
import CheckBox from '@react-native-community/checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function SignUp({navigation}) {
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [rememberUser, setRememberUser] = useState(false);
  const [loading, setLoading] = useState(false);

  // form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function submitSignUp() {
    setLoading(true);
    fetch(
      'https://todoapi-production-61ef.up.railway.app/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({username, email, password, confirmPassword}),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        if (json.status == 'success') {
          rememberUser &&
            EncryptedStorage.setItem(
              'user_credential',
              JSON.stringify({email, password}),
            );
          navigation.reset({
            index: 0,
            routes: [{name: 'Home', params: {token: json.user.token}}],
          });
        } else ToastAndroid.show(json.message, ToastAndroid.LONG);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
    console.log({username, email, password, confirmPassword});
  }

  return (
    <View style={styles.container}>
      <Background />

      <View>
        <ScrollView>
          <View style={styles.viewContainer}>
            <Text style={styles.textTitle}>Sign Up</Text>
            <Gap height={15} />

            <View style={styles.viewSignIn}>
              {/* Input name */}
              <Text style={styles.textInputTitle}>Nama</Text>
              <View style={styles.viewInput}>
                <Icon name={'account'} color={'black'} size={23} />
                <TextInput
                  placeholder="Masukan Nama..."
                  placeholderTextColor={'grey'}
                  autoCapitalize="words"
                  style={styles.input}
                  onChangeText={setUsername}
                />
              </View>

              <Gap height={20} />

              {/* Input email */}
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

              {/* input password */}
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

              <Gap height={20} />

              {/* input confirm password */}
              <Text style={styles.textInputTitle}>Confirm Password</Text>
              <View style={styles.viewInput}>
                <Icon name={'lock'} color={'black'} size={23} />
                <TextInput
                  placeholder="Konfirmasi sandi.."
                  placeholderTextColor={'grey'}
                  style={styles.input}
                  secureTextEntry={secureConfirmPassword}
                  autoCapitalize="none"
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() =>
                    setSecureConfirmPassword(!secureConfirmPassword)
                  }>
                  <Icon
                    name={secureConfirmPassword ? 'eye-off' : 'eye'}
                    color={'black'}
                    size={23}
                  />
                </TouchableOpacity>
              </View>

              {/* checkbox remember me */}
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

              {/* submit & register button */}
              <TouchableNativeFeedback useForeground onPress={submitSignUp}>
                <View style={styles.btnSubmit}>
                  {loading ? (
                    <ActivityIndicator color={'white'} />
                  ) : (
                    <Text style={styles.textBtnTitle}>Daftar</Text>
                  )}
                </View>
              </TouchableNativeFeedback>
              <Gap height={10} />
              <TouchableNativeFeedback
                useForeground
                onPress={() => navigation.goBack()}>
                <View
                  style={{
                    ...styles.btnSubmit,
                    backgroundColor: '#9A4242',
                    width: 150,
                  }}>
                  <Text style={styles.textBtnTitle}>Kembali</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </ScrollView>
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
    justifyContent: 'center',
  },
});
