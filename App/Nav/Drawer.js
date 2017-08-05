import React from 'react';
import { DrawerNavigator, StackNavigator, TabNavigator, DrawerItems } from 'react-navigation';
import { ScrollView } from 'react-native';

import Home from '../Scenes/Home';
import Messages from '../Scenes/Messages';
import Settings from '../Scenes/Settings';
import Login from '../Scenes/Login';
import Signup from '../Scenes/Signup';
import Search from '../Scenes/Search';

import { store } from '../Config/reducer';
import { storage } from '../Config/helpers';

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
    backgroundColor: 'rgb(21, 141, 228)',
  },
  headerTitleStyle: {
    fontSize: 16,
    color: '#fff',
  },
  headerTintColor: 'pink',
});

const navTitle = ({ navigation }) => ({
  title: `Messages with ${navigation.state.params.with}`,
  headerStyle: {
    height: 40,
    backgroundColor: 'rgb(21, 141, 228)',
  },
  headerTitleStyle: {
    fontSize: 16,
    color: '#fff',
  },
  headerTintColor: 'pink',
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
}, {
  mode: 'card',

  // mode: 'modal',
  headerMode: 'float',
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

function CustomDrawerItems(props) {
  return (
      <ScrollView style={{ backgroundColor: 'rgb(18, 52, 88)', flex: 1 }}>
        <DrawerItems {...props} />
      </ScrollView>
  );
}

const On = DrawerNavigator({
  Home: {
    screen: Inside,
  },
  Settings: {
    path: 'settings/',
    screen: Settings,
  },
}, {
  drawerWidth: 260,
  contentComponent: CustomDrawerItems,
  paths: {
    Home: 'eko',
  },
  contentOptions: {
    activeBackgroundColor: 'rgb(18, 42, 78)',
    style: {},
    labelStyle: {
      color: 'white',
    },
  },
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
