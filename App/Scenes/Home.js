import React from 'react';
import {
  Text, View, TextInput, Button,
  Dimensions, TouchableOpacity,
  TouchableHighlight
  } from 'react-native';
import { storage, load, rootURL } from '../helpers';
import { store } from '../reducers';
import request from 'superagent';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [],
      searchVal: '',
    };

    // this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount() {
    this.getUser();
  }

  getUser() {
    storage.load({
      key: 'user',
      id: '1001',
    }).then(res => {
      this.setState({ user: res.user, userId: res.userId });
    })
    .catch(err => {
      console.log(err.name);
    })
    .then(() => {
      request
        .get(rootURL + `api/history/${this.state.user}`)
        .then(res => {
          if (res.body !== null) {
            this.setState({ messages: res.body });
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

  }

  render() {
    console.log(this.state);
    return (
      <View>
        <TouchableHighlight
          underlayColor="pink"
          onPress={() => {
            this.props.navigation.navigate('Search', { name: this.state.user });
          }}
          >
          <Text>Search</Text>
        </TouchableHighlight>


        {this.state.messages.length > 0 &&
          this.state.messages.map(m => {
            const history = (
               <TouchableOpacity
                 key={m.id}
                 onPress={() => {
                    this.props.navigation.navigate(
                      'Messages', {
                        id: m.id,
                        name: this.state.user,
                        with: m.username,
                      });
                  }
                  }>

              <View
                style={styles.card}>
                <Text style={styles.username}>{m.username}</Text>
              </View>
            </TouchableOpacity>
            );
            return history;
          })
        }
      </View>
    );
  }
}

const { width } = Dimensions;
const styles = {
  card: {
    width: width - 20,
    height: 60,
    backgroundColor: '#fff',
    margin: 8,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 3,
  },
  username: {
    paddingLeft: 20,
    fontSize: 16,
  },
};
