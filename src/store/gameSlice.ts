import { createSlice } from '@reduxjs/toolkit';
import { GAME_WIDTH, GAME_CHAR_PIXEL_WIDTH, GAME_HEIGHT } from '../utils';

// center the snake at center of screen initially
const initialSnakeXPos = GAME_WIDTH / 2 - GAME_CHAR_PIXEL_WIDTH * 2;
const initialSnakeYPos = GAME_HEIGHT / 2;

const initialState = {
  snake: [
    { x: initialSnakeXPos + GAME_CHAR_PIXEL_WIDTH * 4, y: initialSnakeYPos },
    { x: initialSnakeXPos + GAME_CHAR_PIXEL_WIDTH * 3, y: initialSnakeYPos },
    { x: initialSnakeXPos + GAME_CHAR_PIXEL_WIDTH * 2, y: initialSnakeYPos },
    { x: initialSnakeXPos + GAME_CHAR_PIXEL_WIDTH, y: initialSnakeYPos },
    { x: initialSnakeXPos, y: initialSnakeYPos },
  ],
  disallowedDirection: '',
  score: 0,
  level: 1, // higher level = higher snake speed, see moveSaga.ts
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    ...initialState,
  },
  reducers: {
    MOVE_SNAKE: (state, action) => {
      let newSnake = [
        {
          x: state.snake[0].x + action.payload.x,
          y: state.snake[0].y + action.payload.y,
        },
        ...state.snake,
      ];
      // remove the last segment coordinates
      newSnake.pop();

      state.snake = newSnake;
    },
    SET_DIS_DIRECTION: (state, action) => {
      state.disallowedDirection = action.payload;
    },
    INCREASE_SNAKE: (state) => {
      console.log('increase snake');
      // append a segment to the end of the snake
      const snakeLen = state.snake.length;

      state.snake = [
        ...state.snake,
        {
          x: state.snake[snakeLen - 1].x - GAME_CHAR_PIXEL_WIDTH,
          y: state.snake[snakeLen - 1].y - GAME_CHAR_PIXEL_WIDTH,
        },
      ];
    },
    LEVEL_UP: (state) => {
      state.level = state.level + 1;
    },
    RESET_GAME_STATE: (state) => {
      state.snake = [...initialState.snake];
      state.disallowedDirection = initialState.disallowedDirection;
      state.score = initialState.score;
      state.level = initialState.level;
    },
    RESET_SCORE: (state) => {
      state.score = 0;
    },
    INCREMENT_SCORE: (state) => {
      state.score = state.score + 2;

      if (state.score % 20 === 0) {
        // every X points increase level
        state.level = state.level + 1;
      }
    },
    STOP_GAME() {},
    RESET_GAME() {},
    MOVE_SNAKE_EVENT(state, action) {},
    MOVE_RIGHT_EVENT() {},
    MOVE_LEFT_EVENT() {},
    MOVE_UP_EVENT() {},
    MOVE_DOWN_EVENT() {},
  },
});

export const {
  MOVE_SNAKE,
  SET_DIS_DIRECTION,
  INCREASE_SNAKE,
  RESET_GAME_STATE,
  RESET_SCORE,
  INCREMENT_SCORE,
  STOP_GAME,
  RESET_GAME,
  MOVE_SNAKE_EVENT,
  MOVE_RIGHT_EVENT,
  MOVE_LEFT_EVENT,
  MOVE_UP_EVENT,
  MOVE_DOWN_EVENT,
} = gameSlice.actions;

export default gameSlice.reducer;
