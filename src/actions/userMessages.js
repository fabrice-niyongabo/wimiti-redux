import Axios from 'axios';
import {backendUrl} from '../Config';
import {uploadChattFile} from '../helpers/fileUploads';

export const SET_USER_MESSAGES = 'SET_USER_MESSAGES';
export const SET_FETCH_USER_MESSAGES_LOADING =
  'SET_FETCH_USER_MESSAGES_LOADING';
export const SET_FETCH_USER_MESSAGES_FAILURE =
  'SET_FETCH_USER_MESSAGES_FAILURE';
export const SET_SEND_MESSAGE = 'SET_SEND_MESSAGE';
export const REMOVE_MESSAGE_FROM_SENDING_LIST =
  'REMOVE_MESSAGE_FROM_SENDING_LIST';
export const ADD_SINGLE_MESSAGE = 'ADD_SINGLE_MESSAGE';
export const SET_CHATT_ROOMS = 'SET_CHATT_ROOMS';

export const setUserMessages = messages => dispatch => {
  dispatch({
    type: SET_USER_MESSAGES,
    payload: messages,
  });
};
export const setFetchUserMessagesLoading = () => dispatch => {
  dispatch({
    type: SET_FETCH_USER_MESSAGES_LOADING,
  });
};
export const removeMessageFromSendingList = message => dispatch => {
  dispatch({
    type: REMOVE_MESSAGE_FROM_SENDING_LIST,
    payload: message,
  });
};

export const setFetchUserMessagesFailure = error => dispatch => {
  dispatch({
    type: SET_FETCH_USER_MESSAGES_FAILURE,
    payload: error,
  });
};

export const setSendMessage = message => dispatch => {
  dispatch({
    type: SET_SEND_MESSAGE,
    payload: message,
  });
};

export const addSingleMessage = message => dispatch => {
  dispatch({
    type: ADD_SINGLE_MESSAGE,
    payload: message,
  });
};

export const setChattRooms = rooms => dispatch => {
  dispatch({
    type: SET_CHATT_ROOMS,
    payload: rooms,
  });
};

export const organiseChattRooms = AllMessages => dispatch => {
  let rooms = AllMessages.concat();
  for (let i = 0; i < rooms.length; ++i) {
    for (let j = i + 1; j < rooms.length; ++j) {
      if (
        (rooms[i].sender == rooms[j].sender &&
          rooms[i].receiver == rooms[j].receiver) ||
        (rooms[i].sender == rooms[j].receiver &&
          rooms[i].receiver == rooms[j].sender)
      ) {
        rooms.splice(j--, 1);
      }
    }
  }

  dispatch(setChattRooms(rooms));
};

export const sendAllMessages =
  ({AllMessages, socket}) =>
  dispatch => {
    try {
      // const messageToBeSent = AllMessages[0];
      const messageToBeSent = AllMessages[AllMessages.length - 1];
      if (messageToBeSent) {
        if (messageToBeSent.file === '') {
          //send only text message
          Axios.post(backendUrl + '/sendMessage', messageToBeSent)
            .then(response => {
              console.log(response.data);
              //dispathchinga actions
              const messageFromServer = response.data.messageSent;
              socket?.emit('sendMessage', messageFromServer);
              const sortedMessages = AllMessages.filter(
                message => message.date != messageToBeSent.date,
              );
              dispatch(addSingleMessage(messageFromServer));
              dispatch(removeMessageFromSendingList(sortedMessages));
            })
            .catch(error => {
              console.log(' message ', error.message);
            });
          //send only text message
        } else {
          // send file message
          //upload the file first
          uploadChattFile(messageToBeSent.file, messageToBeSent.sender)
            .then(res => {
              const updatedMessage = {
                ...messageToBeSent,
                file: JSON.stringify({
                  ...messageToBeSent.file,
                  uri: res.uploadeFileName,
                }),
              };
              //save the message to db
              Axios.post(backendUrl + '/sendMessage', updatedMessage)
                .then(response => {
                  const messageFromServer = response.data.messageSent;
                  socket?.emit('sendMessage', messageFromServer);
                  const sortedMessages = AllMessages.filter(
                    message => message.date != messageToBeSent.date,
                  );
                  dispatch(addSingleMessage(messageFromServer));
                  dispatch(removeMessageFromSendingList(sortedMessages));
                })
                .catch(error => {
                  console.log('error while sending message ', error.message);
                });
            })
            .catch(err => {
              console.log(
                'Error while receiving chatt file sent from server ' + err,
              );
            });
          //send file message
        }
      }
    } catch (error) {
      console.log('js error while sending all message ' + error.message);
    }
  };

export const fetchUserMessages = (username, userId) => dispatch => {
  dispatch(setFetchUserMessagesLoading());
  Axios.post(backendUrl + '/getAllMessages', {
    username,
    userId,
  })
    .then(res => {
      dispatch(setUserMessages(res.data?.messages));
    })
    .catch(err => {
      dispatch(setFetchUserMessagesFailure(err.message));
    });
};

export const markAllMessagesAsDelivered = () => (dispatch, getState) => {
  const {currentUser} = getState();
  Axios.post(backendUrl + '/markAllMessagesAsDelivered', {
    username: currentUser.username,
  })
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.log('Error while marking all messages as delivered. ' + error);
    });
};

export const markAllMessagesAsSeen = sender => (dispatch, getState) => {
  const {currentUser, socketReducer} = getState();
  Axios.post(backendUrl + '/markAllMessagesAsSeen', {
    sender,
    receiver: currentUser.username,
  })
    .then(res => {
      console.log(res.data);
      socketReducer.socket?.emit('markMessagesAsSeen', {
        sender,
        receiver: currentUser.username,
      });
    })
    .catch(error => {
      console.log('Error while marking all messages as seen. ' + error);
    });
};
