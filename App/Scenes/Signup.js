import React from 'react';
import {
  Text, Button, View, TextInput,
   Dimensions, TouchableHighlight, ScrollView } from 'react-native';
import request from 'superagent';
import { rootURL, save, load, storage } from '../Config/helpers';
import { store } from '../Config/reducer';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: null,
      username: '',
      email: '',
      password: '',
      password2: '',
      msg: null,
    };
    this.signup = this.signup.bind(this);
  }

  signup() {
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const password2 = this.state.password2;

    const pac = { username, email, password, password2 };

    request
      .post(rootURL + 'signup')
      .type('form')
      .send(pac)
      .set('Accept', 'application/json')
      .then(res => {
        if (res.body.errors) {
          console.log(res.body.errors);
          this.setState({ errors: res.body.errors });
        } else if (res.body.err) {
          if (res.body.err.code === 11000) {
            this.setState({ msg: 'This email already taken.' });
          } else {
            return;
          }
        } else if (res.body.signup === true) {
          this.setState({
              errors: [],
              msg: 'You are signed up and now you can login',
            });

          let timeout = setTimeout(() => {
            this.props.navigation.navigate('Login');
          }, 3000);
        }
      });
  }

  render() {
    return (
      <ScrollView>
      <View style={styles.view}>
      <Text style={styles.headerText}>Signup</Text>
      {this.state.errors &&
        this.state.errors.map(error => {
          const msg = <Text key={error.msg}>{error.msg}</Text>;
          return msg;
        })
      }
      {this.state.msg &&
          <Text>{this.state.msg}</Text>
      }
      <TextInput
        onChangeText={(username)=> {
          this.setState({ username });
        }}

        onSubmitEditing={(event) => {
          this.refs.email.focus();
        }}

        returnKeyType='next'
        placeholder="Username"
        style={styles.TextInput}/>
      <TextInput
        onChangeText={(email)=> {
          this.setState({ email });
        }}

        onSubmitEditing={(event) => {
          this.refs.password.focus();
        }}

        returnKeyType='next'
        ref="email"
        placeholder="Email"
        style={styles.TextInput}/>
        <TextInput
          onChangeText={(password)=> {
            this.setState({ password });
          }}

          onSubmitEditing={(event) => {
            this.refs.password2.focus();
          }}

          ref="password"
          secureTextEntry={true}
          returnKeyType='next'
          placeholder="Password"
          style={styles.TextInput}/>
      <TextInput
        onChangeText={(password2)=> {
          this.setState({ password2 });
        }}

        ref="password2"
        secureTextEntry={true}
        returnKeyType='send'
        onSubmitEditing={() => {
          this.signup();
        }}

        placeholder="Repeat Password"
        style={styles.TextInput}/>
      <View style={styles.button}>
      <Button
        title="Signup"
        onPress={this.signup}
      />
    </View>
    <TouchableHighlight
      style={{ marginTop: 20 }}
      underlayColor="pink"
      onPress={() => {
        this.props.navigation.navigate('Login');
      }}
      >
      <Text style={{ color: '#eee' }}>Login</Text>
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
