import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export const rootURL = 'https://chat-eko.herokuapp.com/';

export const storage = new Storage({
  size: 1000,

  storageBackend: AsyncStorage,

  defaultExpires: null,

  enableCache: true,
});

export const save = (user, userId) => {
  console.log(user, userId);
  storage.save({
    key: 'user',
    id: 1001,
    data: { user, userId },
    expires: null,
  });
};

export const load = () => {
  storage.load({
    key: 'user',
    id: '1001',
  }).then(user => {
    console.log(user);
  }).catch(err => {
    switch (err.name) {
    case 'NotFoundError':
      console.log('NotFoundError');
    break;
    case 'ExpiredError':
      console.log('ExpiredError');
    break;
  }
  });
};
