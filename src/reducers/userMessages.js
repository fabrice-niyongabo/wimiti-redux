import {
  SET_USER_MESSAGES,
  SET_FETCH_USER_MESSAGES_FAILURE,
  SET_FETCH_USER_MESSAGES_LOADING,
  SET_SEND_MESSAGE,
  REMOVE_MESSAGE_FROM_SENDING_LIST,
  ADD_SINGLE_MESSAGE,
  SET_CHATT_ROOMS,
} from '../actions/userMessages';

const initialState = {
  messages: [],
  loading: true,
  error: '',
  messagesToBeSent: [],
  chattRooms: [],
};

const userMessages = (state = initialState, action) => {
  switch (action.type) {
    case SET_FETCH_USER_MESSAGES_LOADING:
      return {...state, loading: true};
    case SET_USER_MESSAGES:
      return {...state, loading: false, messages: action.payload};
    case ADD_SINGLE_MESSAGE:
      return {...state, messages: [action.payload, ...state.messages]};
    case SET_FETCH_USER_MESSAGES_FAILURE:
      return {...state, loading: false, error: action.payload};
    case SET_SEND_MESSAGE:
      return {
        ...state,
        messagesToBeSent: [action.payload, ...state.messagesToBeSent],
      };
    case REMOVE_MESSAGE_FROM_SENDING_LIST:
      return {
        ...state,
        messagesToBeSent: action.payload,
      };
    case SET_CHATT_ROOMS:
      return {
        ...state,
        chattRooms: action.payload,
      };
    default:
      return state;
  }
};

export default userMessages;
