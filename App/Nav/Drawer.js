import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import Home from '../Scenes/Home';
import Messages from '../Scenes/Messages';
import Settings from '../Scenes/Settings';
import Login from '../Scenes/Login';

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
  Settings: {
    path: 'settings/',
    screen: Settings,
    navigationOptions: navOptions,
  },
});

const Outside = StackNavigator({
  Login: {
    path: 'login/',
    screen: Login,
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
}, { drawerWidth: 200,
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
