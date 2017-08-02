import React from 'react';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { storage } from '../helpers';
import { store } from '../reducers';

import Login from '../Scenes/Login';
import Home from '../Scenes/Home';
import Messages from '../Scenes/Messages';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: Boolean };
  }

  componentWillMount() {
    store.subscribe(() => {
      if (store.getState() === 1) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  render() {
    return (
      this.state.loggedIn ? <Inside /> : <Outside />
    );
  }
}

const navOptions = ({ navigation }) => ({
  title: navigation.state.routeName,
  headerStyle: {
    height: 40,
  },
  headerTitleStyle: {
    fontSize: 16,
  },
});

const navTitle = ({ navigation }) => ({
  title: `Messages with ${navigation.state.params.with}`,
  headerStyle: {
    height: 40,
  },
  headerTitleStyle: {
    fontSize: 16,
  },
});

const Inside = StackNavigator({
  Home: {
    path: 'home/',
    screen: Home,
    navigationOptions: navOptions,
  },
  Messages: {
    path: 'messages/:name',
    screen: Messages,
    navigationOptions: navTitle,
  },
});

const Outside = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: navOptions,
  },
});
