import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const apiKey = "AIzaSyDxWKtcdiBlqRCOGvkHwWHMjIzzMrIqug8";
    let url = isSignup ? "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" : 
                         "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
    axios.post(url + apiKey, authData)
      .then(response => {
        dispatch(authSuccess(response.data.idToken, response.data.localId));
      })
      .catch(error => {
        dispatch(authFail(error.response.data.error));
      });
  };
};
