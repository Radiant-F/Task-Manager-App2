import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import SignIn from './src/screens/SignIn';

export default function App() {
  RNBootSplash.hide({fade: true});
  return <SignIn />;
}

const styles = StyleSheet.create({});
