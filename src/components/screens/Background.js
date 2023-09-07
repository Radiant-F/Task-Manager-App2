import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Background() {
  return (
    <Image
      source={require('../../assets/images/background_image.jpg')}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.5,
      }}
    />
  );
}

const styles = StyleSheet.create({});
