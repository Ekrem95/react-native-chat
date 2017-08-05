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
    return (
      <ScrollView style ={styles.container}>
        <Text>
          Search
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="rgb(139, 139, 139)"
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

const { width } = Dimensions.get('window');
const styles = {
  container: {
    backgroundColor: 'rgb(8, 32, 58)',
    flex: 1,
  },
  card: {
    width: width - 20,
    height: 60,
    backgroundColor: 'rgb(18, 52, 88)',
    margin: 8,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 3,
  },
  username: {
    paddingLeft: 20,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    width: width - 20,
    alignSelf: 'center',
    backgroundColor: 'rgb(12, 36, 60)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgb(0, 67, 122)',
    color: 'white',
    padding: 10,
  },
};
