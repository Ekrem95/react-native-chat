import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import request from 'superagent';
import io from 'socket.io-client';
import { rootURL } from '../helpers';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendMessage = this.sendMessage.bind(this);
    this.get = this.get.bind(this);

    this.sendTo = this.props.navigation.state.params.with;
    this.id = this.props.navigation.state.params.id;
    this.user = this.props.navigation.state.params.name;
  }

  componentWillMount() {
    // if (localStorage.getItem('user') === null) {
    //   this.props.history.push('/login');
    //   return;
    // }
    const user = this.user;
    this.setState({ user });

    this.get();
  }

  // componentDidUpdate() {
  //   if (this.state.sendTo && this.state.user && this.state.messages) {
  //     this.io();
  //   }
  //
  //   window.scrollTo(0, document.body.scrollHeight);
  // }

  getMessages(username) {
    request
      .post(rootURL + 'api/messages/get/' + username)
      .type('form')
      .send({ with: this.sendTo })
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({ messages: res.body.messages });
      })
      .catch(err => {
        console.log(err);
      });
  }

  io() {
    let socket = io.connect(rootURL + '/');

    if (socket !== undefined) {

      socket.on('dist', message => {
        const messages = this.state.messages;
        messages.push(message);
        this.setState({ messages });
      });
      socket.on('id', id => {
        const user = this.state.user;
        if (user !== undefined && user !== null) {
          socket.emit('save id', { user: this.state.user, id });
        }

      });
    }
  }

  get() {
    const sendTo = this.sendTo;
    this.setState({ sendTo });
    this.getMessages(this.user);
  }

  sendMessage() {
    // const message = this.refs.message.value;
    // const from = this.state.user;
    // const to = this.state.sendTo;
    //
    // const pac = { message, from, to };
    //
    // request
    //   .post(rootURL + 'api/messages/' + this.state.username)
    //   .type('form')
    //   .send(pac)
    //   .set('Accept', 'application/json')
    //   .end(function (err, res) {
    //     if (err) {
    //       console.log(err);
    //     }
    //   });
    //
    // let socket = io.connect('/');
    //
    // if (socket !== undefined) {
    //   socket.emit('message', pac);
    // }
    //
    // const messages = this.state.messages;
    // messages.push(pac);
    // this.setState(messages);
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View>
        <Text>Messages with {navigation.state.params.with}</Text>

        <View>
          {this.state.messages &&
            this.state.messages.map((m, i) => {
              const color = this.state.user === m.from ? 'from' : 'to';
              const message = (
                <View
                  key={i}>
                  <Text>{m.message}</Text>
                </View>
              );
              return message;
            })
          }
        </View>
          <View>
          <TextInput
            ref="message"
            />
            <Button title="Send" onPress={this.sendMessage} />
          </View>
      </View>
    );
  }
}
