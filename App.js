import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  RNBootSplash.hide({fade: true});
  return (
    <View>
      <Text>App</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
