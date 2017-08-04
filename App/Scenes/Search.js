import React, { Component } from 'react';
import request from 'superagent';
import { TextInput, View, Text,
   TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { rootURL } from '../Config/helpers';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { searchVal: '', users: null };
    this.search = this.search.bind(this);

    this.user = this.props.navigation.state.params.name;
  }

  search(searchVal) {
    // const name = this.state.searchVal;
    const name = searchVal;

    if (name.length) {
      request
        .get(rootURL + `api/search-users/${name}`)
        .then(res => {
          this.setState({ users: res.body });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({ users: null });
    }
  }

  render() {
    console.log(this.state);
    return (
      <ScrollView>
        <Text>
          Search
        </Text>
        <TextInput
          onChangeText={(searchVal) => {
            this.setState({ searchVal });
            this.search(searchVal);
          }}

         />

         {this.state.users &&
          this.state.users.map(user => {
            if (user.username !== this.user) {
              const userInfo = (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => {
                    request
                      .post(rootURL + `api/history/${this.user}`)
                      .type('form')
                      .send({ username: user.username, id: user.id })
                      .set('Accept', 'application/json')
                      .end((err) => {
                        if (err) console.log(err);
                      });
                    this.props.navigation.navigate(
                      'Messages', {
                        id: user.id,
                        name: this.user,
                        with: user.username,
                      });
                  }
                  }>

                <View style={styles.card}>
                <Text
                  style={styles.username}
                  >{user.username}
                </Text>
              </View>
            </TouchableOpacity>
              );
              return userInfo;
            }
          })
        }
      </ScrollView>
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
