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
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Background, Gap, UserData} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({route}) {
  const token = route.params.token;
  const host = 'https://todoapi-production-61ef.up.railway.app/api/v1';
  const [openDetail, setOpenDetail] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  function getTasks() {
    setLoading(true);
    fetch(`${host}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        if (json.status == 'success') {
          setTasks(json.data.todos);
        } else console.log(json);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    getTasks();
  }, []);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const closeModal = () => setModalAddVisible(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  function addTask() {
    setLoadingAdd(true);
    fetch(`${host}/todos`, {
      method: 'POST',
      body: JSON.stringify({title, desc}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoadingAdd(false);
        if (json.status == 'success') {
          getTasks();
          setModalAddVisible(false);
        } else {
          console.log(json);
          ToastAndroid.show(json.message, ToastAndroid.LONG);
        }
      })
      .catch(error => {
        setLoadingAdd(false);
        console.log(error);
      });
  }

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const closeModalEdit = () => setModalEditVisible(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    desc: '',
    checked: null,
    _id: null,
  });

  function editTask() {
    setLoadingEdit(true);
    fetch(`${host}/todos/${editedTask._id}`, {
      method: 'PUT',
      body: JSON.stringify(editedTask),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoadingEdit(false);
        if (json.status == 'success') {
          getTasks();
          setModalEditVisible(false);
        } else console.log(json);
      })
      .catch(error => {
        setLoadingEdit(false);
        console.log(`ERROR: ${error}`);
      });
  }

  function checklistTask(item) {
    setLoading(true);
    fetch(`${host}/todos/${item._id}`, {
      method: 'PUT',
      body: JSON.stringify({checked: !item.checked}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          getTasks();
        } else {
          setLoading(false);
          console.log(json);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }

  function deleteTask(id) {
    setLoading(true);
    fetch(`${host}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          getTasks();
        } else {
          setLoading(false);
          console.log(json);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }

  function confirmDelete(id) {
    Alert.alert('Hapus', 'Hapus aktivitas?', [
      {
        text: 'Batal',
      },
      {
        text: 'Hapus',
        onPress: () => deleteTask(id),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Background />

      {/* user profile */}
      <UserData token={token} />

      <View style={styles.viewLine} />

      {/* view data */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index}
        refreshing={loading}
        onRefresh={getTasks}
        ListFooterComponent={<Gap height={20} />}
        ListEmptyComponent={
          <Text style={styles.textEmpty}>Tidak ada tugas</Text>
        }
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
                  onValueChange={() => checklistTask(item)}
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
                    {/* button delete */}
                    <TouchableNativeFeedback
                      useForeground
                      onPress={() => confirmDelete(item._id)}>
                      <View style={styles.btnDelete}>
                        <Icon name="trash-can" color={'white'} size={20} />
                      </View>
                    </TouchableNativeFeedback>
                    <Gap width={10} />

                    {/* button edit */}
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
                  onChangeText={setTitle}
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
                  onChangeText={setDesc}
                />
              </View>

              <Gap height={30} />

              {/* button submit */}
              <TouchableNativeFeedback useForeground onPress={addTask}>
                <View style={styles.btnSubmitAdd}>
                  {loadingAdd ? (
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
                  value={editedTask.desc}
                  onChangeText={desc => setEditedTask({...editedTask, desc})}
                />
              </View>

              <Gap height={30} />

              {/* button submit */}
              <TouchableNativeFeedback useForeground onPress={editTask}>
                <View style={styles.btnSubmitAdd}>
                  {loadingEdit ? (
                    <ActivityIndicator color={'white'} />
                  ) : (
                    <Text style={styles.textBtnTitle}>Ubah</Text>
                  )}
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
  textEmpty: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
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
