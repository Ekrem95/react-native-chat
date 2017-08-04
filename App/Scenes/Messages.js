import React from 'react';
import { Text, View, Button, TextInput, ScrollView, Dimensions } from 'react-native';
import request from 'superagent';
import io from 'socket.io-client';
import { rootURL } from '../Config/helpers';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
         'Setting a timer',
     ];
    this.state = {};
    this.sendMessage = this.sendMessage.bind(this);
    this.get = this.get.bind(this);

    this.sendTo = this.props.navigation.state.params.with;
    this.id = this.props.navigation.state.params.id;
    this.user = this.props.navigation.state.params.name;
  }

  componentWillMount() {
    const user = this.user;
    this.setState({ user });

    this.get();
  }

  componentDidUpdate() {
    // if (this.state.sendTo && this.state.user && this.state.messages) {
    this.io();

    // }

    // const { height } = Dimensions.get('window');
    // this.refs.scrollView.scrollTo({ y: height });
  }

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
    let socket = io.connect(rootURL);

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
    const message = this.state.message;
    const from = this.state.user;
    const to = this.state.sendTo;

    const pac = { message, from, to };

    request
      .post(rootURL + 'api/messages/' + this.state.username)
      .type('form')
      .send(pac)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          console.log(err);
        }
      });

    let socket = io.connect(rootURL);

    if (socket !== undefined) {
      socket.emit('message', pac);
    }

    const messages = this.state.messages;
    messages.push(pac);
    this.setState(messages);
    this.refs.TextInput.setNativeProps({ text: '' });
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View style ={styles.container}>
      <View style={{ flex: 9 }}>
      <ScrollView
        ref={ref => this.scrollView = ref}
        onContentSizeChange={(contentWidth, contentHeight)=> {
        this.scrollView.scrollToEnd({ animated: true });
      }}
        >
        <View style={styles.page}>
          {this.state.messages &&
            this.state.messages.map((m, i) => {
                let color;
                if (this.state.user === m.from) {
                  color = styles.to;
                } else {
                  color = styles.from;
                }

                const message = (
                  <View
                    style={{ ...color, ...styles.common, }}

                    key={i}>
                  <Text style={styles.text}>{m.message}</Text>
                </View>
                );
                return message;
              })
          }
        </View>

      </ScrollView>
      </View>
      <View style={{ flex: 1.2, justifyContent: 'flex-end' }}>
      {this.state.messages &&
        <View style={styles.inputBox}>
        <TextInput
          style={styles.TextInput}
          onChangeText={(message) => {
            this.setState({ message });
          }}

          ref="TextInput"
          returnKeyType='send'
          onSubmitEditing={() => {
            this.sendMessage();
          }}

          />
          <View style={styles.Button}>
            <Button title="Send" onPress={this.sendMessage} />
          </View>
        </View>
      }
      </View>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');
const styles = {
  container: {
    backgroundColor: 'rgb(18, 52, 88)',
    flex: 1,
  },
  page: {
    display: 'flex',
  },
  common: {
    margin: 10,
    borderRadius: 3,
    width: width - 160,
  },
  from: {
    backgroundColor: 'rgb(40, 126, 205)',
    alignSelf: 'flex-end',
  },
  to: {
    backgroundColor: 'rgb(31, 179, 108)',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    padding: 9,
  },
  TextInput: {
    flex: 0.75,
  },
  Button: {
    flex: 0.25,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
};
