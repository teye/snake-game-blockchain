import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import userReducer from './userSlice';
import nftReducer from './nftSlice';
import blockchainReducer from './blockchainSlice';
import gameLogicReducer from './gameSlice';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    game: gameLogicReducer,
    blockchain: blockchainReducer,
    user: userReducer,
    nft: nftReducer,
  },
  middleware: [sagaMiddleware],
});

console.log(store.getState());

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
