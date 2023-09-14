import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Gap from '../Gap';

export default function ModalAddTask({
  visible,
  onRequestClose,
  onChangeTitle,
  onChangeDesc,
  onPressSubmit,
  loading,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalBackdrop} onPress={onRequestClose} />
        <View style={styles.viewModalContainer}>
          <View style={styles.viewModalHeader}>
            <Icon name={'notebook-plus-outline'} color={'white'} size={23} />
            <Text style={styles.textDefault}>Tambah Tugas</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Icon name={'close-circle-outline'} color={'white'} size={23} />
            </TouchableOpacity>
          </View>
          <View style={styles.viewModalInput}>
            {/* input task title */}
            <Text style={styles.textInputTitle}>Judul</Text>
            <View style={styles.viewInput}>
              <Icon name={'gmail'} color={'black'} size={23} />
              <TextInput
                placeholder="Judul tugas..."
                placeholderTextColor={'grey'}
                style={styles.input}
                onChangeText={onChangeTitle}
              />
            </View>

            <Gap height={15} />

            {/* input task desc */}
            <Text style={styles.textInputTitle}>Deskripsi</Text>
            <View style={styles.viewInput}>
              <Icon name={'lock'} color={'black'} size={23} />
              <TextInput
                placeholder="Deskripsi tugas.."
                placeholderTextColor={'grey'}
                style={styles.input}
                onChangeText={onChangeDesc}
              />
            </View>

            <Gap height={30} />

            {/* button submit */}
            <TouchableNativeFeedback useForeground onPress={onPressSubmit}>
              <View style={styles.btnSubmitAdd}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.textBtnTitle}>Buat</Text>
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textBtnTitle: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 15,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'black',
  },
  btnSubmitAdd: {
    height: 45,
    backgroundColor: '#00677E',
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 45 / 2,
    elevation: 3,
    justifyContent: 'center',
    width: 120,
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
  viewModalInput: {
    padding: 30,
    paddingTop: 0,
  },
  textDefault: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  viewModalHeader: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  viewModalContainer: {
    backgroundColor: '#164877',
    width: '85%',
    alignSelf: 'center',
    maxWidth: 480,
    borderRadius: 20,
    elevation: 5,
  },
  modalBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.4,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
