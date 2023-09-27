import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  increment,
  decrement,
  incrementBy,
  decrementBy,
} from '../redux/slice/counterSlice';

export default function Counter() {
  const dispatch = useDispatch();
  const counterState = useSelector(state => state.counter);

  return (
    <View>
      <Text style={{fontSize: 50, color: 'black'}}>{counterState.count}</Text>
      <Button title="tambah" onPress={() => dispatch(increment())} />
      <Button title="kurang" onPress={() => dispatch(decrement())} />
      <Button
        title="tambah dengan nilai..."
        onPress={() => dispatch(incrementBy(12))}
      />
      <Button
        title="kurangi dengan nilai..."
        onPress={() => dispatch(decrementBy(12))}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
