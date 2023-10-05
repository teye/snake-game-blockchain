import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: '0',
  nftBalance: 0,
  wallet: '',
  isConnected: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...initialState,
  },
  reducers: {
    UPDATE_BALANCE: (state, action) => {
      state.balance = action.payload;
    },
    UPDATE_NFT_BALANCE: (state, action) => {
      state.nftBalance = action.payload;
    },
    UPDATE_WALLET: (state, action) => {
      state.wallet = action.payload;
    },
    UPDATE_IS_CONNECTED: (state, action) => {
      state.isConnected = action.payload;
    },
    USER_RESET: (state) => {
      state = initialState;
    },
  },
});

export const { UPDATE_BALANCE, UPDATE_NFT_BALANCE, UPDATE_WALLET, UPDATE_IS_CONNECTED, USER_RESET } = userSlice.actions;

export default userSlice.reducer;
