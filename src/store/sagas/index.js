import { takeEvery } from 'redux-saga/effects';

import { logoutSaga, checkAuthTimeoutSaga } from './auth';
import * as actionTypes from '../actions/actionTypes';

export function* watchAuth(action) {
  yield takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga);
  yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
}
