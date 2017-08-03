import React from 'react';
import { Text, View, TextInput, Button, Dimensions, TouchableOpacity } from 'react-native';
import { storage, load, rootURL } from '../helpers';
import { store } from '../reducers';
import request from 'superagent';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      users: [],
      messages: [],
      searchVal: '',
    };

    // this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.getUser();
    // store.dispatch({ type: 'UNAUTH' });
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

  search() {
    const name = this.state.searchVal;

    if (name.length) {
      request
        .get(rootURL + `api/search-users/${name}`)
        .then(res => {
          this.setState({ users: res.body });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <View>

         {this.state.users &&
          this.state.users.map(user => {
            if (user.id !== this.state.userId) {
              const userInfo = (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => {
                    this.props.navigation.navigate(
                      'Messages', {
                        id: user.id,
                        name: this.state.user,
                        with: user.username,
                      });
                  }
                  }>

                <View style={styles.card}>
                <Text
                  style={styles.username}
                  onClick={() => {
                    const selectedUser = { username: user.username, id: user.id };
                    const messages = this.state.messages;
                    messages[selectedUser.username] = selectedUser.id;
                    this.setState({ messages });

                    request
                      .post(rootURL + `api/history/${this.state.user}`)
                      .type('form')
                      .send({ username: user.username, id: user.id })
                      .set('Accept', 'application/json')
                      .end((err) => {
                        if (err) console.log(err);
                      });

                    // this.props.history.push(`/messages/${user.id}`);
                  }}

                  >{user.username}
                </Text>
              </View>
            </TouchableOpacity>
              );
              return userInfo;
            }
          })
        }

        <TextInput
          onChangeText={(searchVal) => {
            this.setState({ searchVal });
          }}

         />
         <Button title="Search" onPress={this.search}/>

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
