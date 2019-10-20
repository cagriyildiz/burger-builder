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

export const logout = () => {
  return {
    type: actionTypes.AUTH_INIT_LOGOUT
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime: expirationTime
  };
};

const setUserDataToLocalStorage = (idToken, expiresIn, localId) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', idToken);
  localStorage.setItem('expirationDate', expirationDate);
  localStorage.setItem('localId', localId);
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
        setUserDataToLocalStorage(response.data.idToken, response.data.expiresIn, response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => {
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    const localId = localStorage.getItem('localId');
    if (token) {
      if (expirationDate > new Date()) {
        dispatch(authSuccess(token, localId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      } else {
        dispatch(logout());  
      }
    } else {
      dispatch(logout());
    }
  }
};
