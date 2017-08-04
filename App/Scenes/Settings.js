import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { storage } from '../Config/helpers';
import { store } from '../Config/reducer';

export default class Settings extends Component {
  // componentWillMount() {
  //   this.props.navigation.navigate('Home');
  // }

  render() {
    return (
      <View>
        <Button
          title="Logout"
          onPress={() => {
            storage.clearMapForKey('user');
            store.dispatch({ type: 'UNAUTH' });

            // this.props.navigation.navigate('Login');
          }}

        />
      </View>
    );
  }
}
