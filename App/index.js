import React, { Component } from 'react';
import Drawer from './Nav/Drawer';
import { View } from 'react-native';

export default class Chat extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(18, 52, 88)' }}>
        <Drawer />
      </View>
    );
  }
}
