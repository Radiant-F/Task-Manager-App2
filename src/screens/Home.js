import {
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Background,
  Gap,
  UserData,
  RenderItem,
  ModalAddTask,
  ModalEditTask,
} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({navigation}) {
  const {token} = useSelector(state => state.user);
  const [openDetail, setOpenDetail] = useState(null);

  const instance = axios.create({
    baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;

      try {
        if (error.response && error.response.data.message === 'jwt expired') {
          const value = await EncryptedStorage.getItem('user_credential');
          const response = await instance.post(
            '/auth/login',
            JSON.parse(value),
          );
          const token = response.data.user.token;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return instance(originalRequest);
        }
      } catch (error) {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getTasks() {
    setLoading(true);
    try {
      const {data} = await instance.get('/todos');
      setLoading(false);
      setTasks(data.data.todos);
    } catch (error) {
      setLoading(false);
      // console.log('CATCH ERROR', error.response.data);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const closeModal = () => setModalAddVisible(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function addTask() {
    setLoadingAdd(true);
    try {
      await instance.post('/todos', {title, desc});
      setLoadingAdd(false);
      getTasks();
      setModalAddVisible(false);
    } catch (error) {
      setLoadingAdd(false);
      console.log(error.response.data);
      ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
    }
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

  async function editTask() {
    setLoadingEdit(true);
    try {
      await instance.put(`/todos/${editedTask._id}`, editedTask);
      setLoadingEdit(false);
      getTasks();
      setModalEditVisible(false);
    } catch (error) {
      setLoadingEdit(false);
      if (error.response) {
        console.log(error.response.data);
        ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      } else console.log(error);
    }
  }

  async function checklistTask(item) {
    setLoading(true);
    try {
      await instance.put(`/todos/${item._id}`, {checked: !item.checked});
      getTasks();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function deleteTask(id) {
    setLoading(true);
    try {
      await instance.delete(`/todos/${id}`);
      getTasks();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
      <UserData token={token} navigation={navigation} />

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
            <RenderItem
              item={item}
              onChecklist={() => checklistTask(item)}
              onPressDetail={handleOpenDetail}
              open={open}
              onPressDelete={() => confirmDelete(item._id)}
              onPressEdit={() => {
                setModalEditVisible(true);
                setEditedTask(item);
              }}
            />
          );
        }}
      />

      <View style={styles.viewLine} />

      {/* button add */}
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
      <ModalAddTask
        visible={modalAddVisible}
        loading={loadingAdd}
        onChangeDesc={setDesc}
        onChangeTitle={setTitle}
        onPressSubmit={addTask}
        onRequestClose={closeModal}
      />

      {/* modal edit */}
      <ModalEditTask
        loading={loadingEdit}
        onChangeTitle={title => setEditedTask({...editedTask, title})}
        onChangeDesc={desc => setEditedTask({...editedTask, desc})}
        onPressSubmit={editTask}
        onRequestClose={closeModalEdit}
        valueDesc={editedTask.desc}
        valueTitle={editedTask.title}
        visible={modalEditVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textEmpty: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
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
  viewLine: {
    width: '85%',
    height: 2,
    backgroundColor: 'white',
    alignSelf: 'center',
    transform: [{rotate: '-2deg'}],
    marginVertical: 30,
    marginBottom: 25,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
