import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Gap from '../Gap';

export default function RenderItem({
  item,
  onChecklist,
  onPressDetail,
  open,
  onPressDelete,
  onPressEdit,
}) {
  return (
    <View style={styles.viewItem}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          value={item.checked}
          tintColors={{true: 'white', false: 'white'}}
          onValueChange={onChecklist}
        />
        <Text style={styles.textItemTitle}>{item.title}</Text>
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple('#ffffff42')}
          onPress={onPressDetail}>
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
            <TouchableNativeFeedback useForeground onPress={onPressDelete}>
              <View style={styles.btnDelete}>
                <Icon name="trash-can" color={'white'} size={20} />
              </View>
            </TouchableNativeFeedback>
            <Gap width={10} />

            {/* button edit */}
            <TouchableNativeFeedback useForeground onPress={onPressEdit}>
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
}

const styles = StyleSheet.create({
  textDefault: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
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
});
