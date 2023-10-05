import { all } from 'redux-saga/effects';
import blockchainSaga from './blockchainSaga';
import { watcherMoveSaga } from './moveSaga';

export function* rootSaga() {
  yield all([blockchainSaga(), watcherMoveSaga()]);
}
