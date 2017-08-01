import React from 'react';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native';

import Login from '../Scenes/Login';
import Home from '../Scenes/Home';

export default class Nav extends React.Component {
  render() {
    console.log('*******************************************');
    AsyncStorage.setItem('chat-app-user'._55, 'eko');
    console.log(AsyncStorage.getItem('chat-app-user'));
    return (
      <Modal />
    );
  }
}

const Inside = StackNavigator({
  Home: {
    path: 'home/',
    screen: Home,
    navigationOptions: navOptions,
  },
});

const Outside = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: navOptions,
  },
});

const navOptions = ({ navigation }) => ({
  title: navigation.state.routeName,
  headerStyle: {
    height: 40,
  },
  headerTitleStyle: {
    fontSize: 16,
  },
});

const Modal = AsyncStorage.getItem('chat-app-user')._55 === null ? Outside : Inside;
