import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Background, Gap} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home() {
  const [openDetail, setOpenDetail] = useState(null);
  const dummyData = [
    {
      title: 'Tugas Datu',
      desc: 'Deskripsi tugas satu',
      checked: false,
      id: 1,
    },
    {
      title: 'Tugas Dua',
      desc: 'Deskripsi tugas dua',
      checked: true,
      id: 2,
    },
    {
      title: 'Tugas Tiga',
      desc: 'Deskripsi tugas tiga yang sangat panjang sekali.',
      checked: true,
      id: 3,
    },
  ];

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const closeModal = () => setModalAddVisible(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  function addTask() {
    console.log({title, desc});
  }

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const closeModalEdit = () => setModalEditVisible(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    desc: '',
    checked: null,
    id: null,
  });

  function editTask() {
    console.log(editedTask);
    setModalEditVisible(false);
  }

  return (
    <View style={styles.container}>
      <Background />

      {/* user profile */}
      <View style={styles.viewProfile}>
        <View>
          <Text style={styles.textDefault}>Hi,</Text>
          <Text style={styles.textUserName}>User Name</Text>
        </View>
        <Icon name="account-circle" color="white" size={50} />
      </View>

      <View style={styles.viewLine} />

      {/* view data */}
      <FlatList
        data={dummyData}
        keyExtractor={(item, index) => index}
        ListFooterComponent={<Gap height={20} />}
        renderItem={({item, index}) => {
          const handleOpenDetail = () => {
            LayoutAnimation.easeInEaseOut();
            setOpenDetail(index == openDetail ? null : index);
          };
          const open = openDetail == index;
          return (
            <View style={styles.viewItem}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={item.checked}
                  tintColors={{true: 'white', false: 'white'}}
                />
                <Text style={styles.textItemTitle}>{item.title}</Text>
                <TouchableNativeFeedback
                  useForeground
                  background={TouchableNativeFeedback.Ripple('#ffffff42')}
                  onPress={handleOpenDetail}>
                  <View style={styles.btnDetail}>
                    <Icon
                      name={open ? 'chevron-up' : 'chevron-down'}
                      color={'white'}
                      size={30}
                    />
                  </View>
                </TouchableNativeFeedback>
              </View>
              {open && (
                <View>
                  <Text style={styles.textDefault}>{item.desc}</Text>
                  <View style={styles.viewBtnOption}>
                    <TouchableNativeFeedback useForeground>
                      <View style={styles.btnDelete}>
                        <Icon name="trash-can" color={'white'} size={20} />
                      </View>
                    </TouchableNativeFeedback>
                    <Gap width={10} />
                    <TouchableNativeFeedback
                      useForeground
                      onPress={() => {
                        setModalEditVisible(true);
                        setEditedTask(item);
                      }}>
                      <View style={styles.btnEdit}>
                        <Icon name="pencil" color={'white'} size={20} />
                        <Gap width={10} />
                        <Text style={styles.textDefault}>Edit</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* button add */}
      <View style={styles.viewLine} />
      <TouchableNativeFeedback
        useForeground
        onPress={() => setModalAddVisible(true)}>
        <View style={styles.btnAdd}>
          <Icon name="plus-circle-outline" color={'white'} size={20} />
          <Gap width={5} />
          <Text style={styles.textBtnTitle}>Tambah</Text>
        </View>
      </TouchableNativeFeedback>

      <Gap height={30} />

      {/* modal add */}
      <Modal
        visible={modalAddVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.viewModalContainer}>
            <View style={styles.viewModalHeader}>
              <Icon name={'notebook-plus-outline'} color={'white'} size={23} />
              <Text style={styles.textDefault}>Tambah Tugas</Text>
              <TouchableOpacity onPress={closeModal}>
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
                />
              </View>

              <Gap height={30} />

              {/* button submit */}
              <TouchableNativeFeedback useForeground>
                <View style={styles.btnSubmitAdd}>
                  <Text style={styles.textBtnTitle}>Buat</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal edit */}
      <Modal
        visible={modalEditVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModalEdit}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={closeModalEdit} />
          <View style={styles.viewModalContainer}>
            <View style={styles.viewModalHeader}>
              <Icon name={'notebook-edit-outline'} color={'white'} size={23} />
              <Text style={styles.textDefault}>Edit Tugas</Text>
              <TouchableOpacity onPress={closeModalEdit}>
                <Icon name={'close-circle-outline'} color={'white'} size={23} />
              </TouchableOpacity>
            </View>
            <View style={styles.viewModalInput}>
              {/* input task title */}
              <Text style={styles.textInputTitle}>Judul</Text>
              <View style={styles.viewInput}>
                <Icon name={'notebook-outline'} color={'black'} size={23} />
                <TextInput
                  placeholder="Judul tugas..."
                  placeholderTextColor={'grey'}
                  style={styles.input}
                  value={editedTask.title}
                  onChangeText={title => setEditedTask({...editedTask, title})}
                />
              </View>

              <Gap height={15} />

              {/* input task desc */}
              <Text style={styles.textInputTitle}>Deskripsi</Text>
              <View style={styles.viewInput}>
                <Icon name={'text-box-outline'} color={'black'} size={23} />
                <TextInput
                  placeholder="Deskripsi tugas.."
                  placeholderTextColor={'grey'}
                  style={styles.input}
                  onChangeText={desc => setEditedTask({...editedTask, desc})}
                  value={editedTask.desc}
                />
              </View>

              <Gap height={30} />

              {/* button submit */}
              <TouchableNativeFeedback useForeground onPress={editTask}>
                <View style={styles.btnSubmitAdd}>
                  <Text style={styles.textBtnTitle}>Ubah</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 50,
    alignSelf: 'center',
    borderRadius: 45 / 2,
    elevation: 3,
    justifyContent: 'center',
  },
  viewModalInput: {
    padding: 30,
    paddingTop: 0,
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
  textBtnTitle: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 15,
  },
  btnAdd: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#164877',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
    marginTop: -50,
    borderRadius: 50 / 2,
    elevation: 3,
    overflow: 'hidden',
  },
  viewBtnOption: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: 15,
  },
  btnDelete: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9A4242',
    elevation: 3,
    overflow: 'hidden',
  },
  btnEdit: {
    height: 35,
    backgroundColor: '#164877',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingRight: 20,
    borderRadius: 35 / 2,
    elevation: 3,
    overflow: 'hidden',
  },
  textItemTitle: {
    flex: 1,
    textAlign: 'right',
    color: 'white',
    marginHorizontal: 20,
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 20,
    marginVertical: 30,
  },
  btnDetail: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewItem: {
    marginHorizontal: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    overflow: 'hidden',
    marginBottom: 1,
    paddingHorizontal: 5,
  },
  viewLine: {
    width: '85%',
    height: 2,
    backgroundColor: 'white',
    alignSelf: 'center',
    transform: [{rotate: '-2deg'}],
    marginVertical: 30,
    marginBottom: 25,
  },
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
