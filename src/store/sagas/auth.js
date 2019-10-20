import { put, delay } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('localId');
  yield put(actions.logoutSuccess());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

const setUserDataToLocalStorage = (idToken, expiresIn, localId) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', idToken);
  localStorage.setItem('expirationDate', expirationDate);
  localStorage.setItem('localId', localId);
};

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };
  const apiKey = "AIzaSyDxWKtcdiBlqRCOGvkHwWHMjIzzMrIqug8";
  let url = action.isSignup ? "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" : 
                        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  
  try {
    const response = yield axios.post(url + apiKey, authData);  
    setUserDataToLocalStorage(response.data.idToken, response.data.expiresIn, response.data.localId);
    yield put(actions.authSuccess(response.data.idToken, response.data.localId));
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }    
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');
  const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
  const localId = yield localStorage.getItem('localId');
  if (token) {
    if (expirationDate > new Date()) {
      yield put(actions.authSuccess(token, localId));
      yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
    } else {
      yield put (actions.logout());
    }
  } else {
    yield put (actions.logout());
  }
}
