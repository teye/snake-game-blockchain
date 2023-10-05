import { delay, put, takeLatest } from 'redux-saga/effects';
import { DOWN, LEFT, RIGHT, UP } from '../actions';
import {
  MOVE_DOWN_EVENT,
  MOVE_LEFT_EVENT,
  MOVE_RIGHT_EVENT,
  MOVE_SNAKE,
  MOVE_SNAKE_EVENT,
  MOVE_UP_EVENT,
  RESET_GAME,
  SET_DIS_DIRECTION,
  STOP_GAME,
} from '../gameSlice';

export function* moveSaga(actions: any) {
  // keep looping to move the snake
  while (actions.type !== RESET_GAME.toString() && actions.type !== STOP_GAME.toString()) {
    // run the snake
    yield put(
      MOVE_SNAKE({
        x: actions.payload.x,
        y: actions.payload.y,
      }),
    );

    // set the invalid direction
    // invalid direction is always opposite
    switch (actions.payload.direction.type.toString()) {
      case `${MOVE_RIGHT_EVENT}`:
        yield put(SET_DIS_DIRECTION(LEFT));
        break;
      case `${MOVE_LEFT_EVENT}`:
        yield put(SET_DIS_DIRECTION(RIGHT));
        break;
      case `${MOVE_UP_EVENT}`:
        yield put(SET_DIS_DIRECTION(DOWN));
        break;
      case `${MOVE_DOWN_EVENT}`:
        yield put(SET_DIS_DIRECTION(UP));
        break;
    }
    yield delay(100);
  }
}

export function* watcherMoveSaga() {
  yield takeLatest([MOVE_SNAKE_EVENT, RESET_GAME, STOP_GAME], moveSaga);
}
