import { createStore } from 'redux';

const reducer = (state, action) => {
  if (action.type === 'AUTH') {
    return state = 1;
  }

  if (action.type === 'UNAUTH') {
    return state = 0;
  }

  return state;
};

export const store = createStore(reducer, 6);
