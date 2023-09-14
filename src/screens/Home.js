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

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({route, navigation}) {
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
