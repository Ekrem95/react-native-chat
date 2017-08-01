import React from 'react';
import { Text, Button, View, TextInput, Dimensions } from 'react-native';
import request from 'superagent';
import { rootURL } from '../helper';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.login = this.login.bind(this);
  }

  login() {
    const email = this.refs.email._lastNativeText;
    const password = this.refs.password._lastNativeText;

    if (email.length > 1 && password.length > 1) {
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
          }
        });
    }
  }

  render() {
    return (
      <View style={styles.view}>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        ref="email"
        placeholder="Email"
        style={styles.TextInput}/>
      <TextInput
        ref="password"
        placeholder="Password"
        style={styles.TextInput}/>
      <View style={styles.button}>
      <Button
        title="Login"
        onPress={this.login}
      />
    </View>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');
const styles = {
  view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  headerText: {
    fontSize: 24,
  },
  TextInput: {
    width: width - 90,
  },
  button: {
    marginTop: 20,
    width: 90,
  },
};
