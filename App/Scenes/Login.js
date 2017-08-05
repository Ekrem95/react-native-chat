import React from 'react';
import {
   Text, Button, View, TextInput,
   Dimensions, TouchableHighlight, ScrollView } from 'react-native';
import request from 'superagent';
import { rootURL, save, load, storage } from '../Config/helpers';
import { store } from '../Config/reducer';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.login = this.login.bind(this);
  }

  // componentWillMount() {
  //   // load();
  // }

  login() {
    if (this.state.email.length > 1 &&
       this.state.password.length > 1) {

      const email = this.state.email;
      const password = this.state.password;

      const pac = { email, password };

      request
        .post(rootURL + 'login')
        .type('form')
        .send(pac)
        .set('Accept', 'application/json')
        .then(res => {
          if (res.body === null) {
            this.setState({
              error: `Invalid email & password combination.
                      Please try again.`,
            });
          } else {
            // localStorage.setItem('token', res.body.token);
            // localStorage.setItem('user', res.body.user);
            // localStorage.setItem('userId', res.body.userId);
            // this.props.history.push('/');
            this.setState({ error: null });
            save(res.body.user, res.body.userId);
            store.dispatch({ type: 'AUTH' });
          }
        });
    }
  }

  render() {
    return (
      <ScrollView>
      <View style={styles.view}>
      <Text style={styles.headerText}>Login</Text>
      {this.state.error &&
        <Text>{this.state.error}</Text>
      }
      <TextInput
        onChangeText={(email)=> {
          this.setState({ email });
        }}

        onSubmitEditing={(event) => {
          this.refs.password.focus();
        }}

        returnKeyType='next'
        placeholder="Email"
        placeholderTextColor="rgb(139, 139, 139)"
        style={styles.TextInput}/>
      <TextInput
        onChangeText={(password)=> {
          this.setState({ password });
        }}

        secureTextEntry={true}
        returnKeyType='send'
        onSubmitEditing={() => {
          this.login();
        }}

        ref="password"
        placeholder="Password"
        placeholderTextColor="rgb(139, 139, 139)"
        style={styles.TextInput}/>
      <View style={styles.button}>
      <Button
        title="Login"
        onPress={this.login}
      />
    </View>
      <TouchableHighlight
        style={{ marginTop: 20 }}
        underlayColor="pink"
        onPress={() => {
          this.props.navigation.navigate('Signup');
        }}
        >
        <Text style={{ color: '#eee' }}>Signup</Text>
      </TouchableHighlight>
      </View>
      </ScrollView>
    );
  }
}

const { width } = Dimensions.get('window');
const styles = {
  view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  TextInput: {
    width: width - 90,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 6,
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgb(8, 32, 58)',
  },
  button: {
    marginTop: 20,
    width: 90,
  },
};
