import React from 'react';
import { DrawerNavigator, StackNavigator, TabNavigator } from 'react-navigation';

import Home from '../Scenes/Home';
import Messages from '../Scenes/Messages';
import Settings from '../Scenes/Settings';
import Login from '../Scenes/Login';
import Signup from '../Scenes/Signup';
import Search from '../Scenes/Search';

import { store } from '../reducers';
import { storage } from '../helpers';

export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: Boolean };
  }

  componentWillMount() {
    storage.load({
      key: 'user',
      id: '1001',
    }).then(user => {
      this.setState({ loggedIn: true });
    }).catch(err => {
      this.setState({ loggedIn: false });
    });

    store.subscribe(() => {
      if (store.getState() === 1) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });

    // if (store.getState() === 1) {
    //   this.setState({ loggedIn: true });
    // } else {
    //   this.setState({ loggedIn: false });
    // }

    // let eko = setTimeout(()=> {
    //   store.dispatch({ type: 'AUTH' });
    // }, 4000);
  }

  render() {
    return (
      this.state.loggedIn ? <On /> : <Off />
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
  Search: {
    path: 'search',
    screen: Search,
    navigationOptions: navOptions,
  },
});

const Outside = TabNavigator({
  Login: {
    path: 'login/',
    screen: Login,
    navigationOptions: navOptions,
  },
  Signup: {
    path: 'signup/',
    screen: Signup,
    navigationOptions: navOptions,
  },
});

const On = DrawerNavigator({
  Home: {
    screen: Inside,
  },
  Settings: {
    path: 'settings/',
    screen: Settings,
  },
}, {
  drawerWidth: 200,
  paths: {
    Home: 'eko',
  },
  contentOptions: {},
}
);
const Off = DrawerNavigator({
  Login: {
    screen: Outside,
  },
}, { drawerWidth: 200,
    contentOptions: {},
  }
);
