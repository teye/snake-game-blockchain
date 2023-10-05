import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokenURI: '',
  tokenID: '',
  rarity: '',
};

export const nftSlice = createSlice({
  name: 'nft',
  initialState: {
    ...initialState,
  },
  reducers: {
    UPDATE_TOKEN_URI: (state, action) => {
      state.tokenURI = action.payload;
    },
    UPDATE_TOKEN_ID: (state, action) => {
      state.tokenID = action.payload;
    },
    UPDATE_RARITY: (state, action) => {
      state.rarity = action.payload;
    },
    RESET: (state) => {
      state = initialState;
    },
  },
});

export const { UPDATE_TOKEN_URI, UPDATE_TOKEN_ID, UPDATE_RARITY } = nftSlice.actions;

export default nftSlice.reducer;
