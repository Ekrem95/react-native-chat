import React from 'react';
import {
  Text, View, TextInput, Button,
  Dimensions, TouchableOpacity,
  TouchableHighlight, ScrollView,
  } from 'react-native';
import { storage, load, rootURL } from '../Config/helpers';
import { store } from '../Config/reducer';
import request from 'superagent';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [],
      searchVal: '',
    };
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
    return (
      <ScrollView style ={styles.container}>
        <TouchableHighlight
          underlayColor="pink"
          onPress={() => {
            this.props.navigation.navigate('Search', { name: this.state.user });
          }}
          >
          <Text style ={{ color: '#fff' }}>Search</Text>
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
      </ScrollView>
    );
  }
}

const { width } = Dimensions.get('window');
const styles = {
  container: {
    backgroundColor: 'rgb(18, 52, 88)',
    flex: 1,
  },
  card: {
    width: width - 20,
    height: 60,
    backgroundColor: '#fff',
    margin: 8,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 3,
    alignSelf: 'center',
  },
  username: {
    paddingLeft: 20,
    fontSize: 16,
  },
};
