import { put } from 'redux-saga/effects';

import * as actions from '../actions/index';

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('localId');
  yield put(actions.logoutSuccess());
}
