import { createSlice } from '@reduxjs/toolkit';

export const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState: {},
  reducers: {
    SUBMIT_HIGH_SCORE(state, action) {},
  },
});

export const { SUBMIT_HIGH_SCORE } = blockchainSlice.actions;

export default blockchainSlice.reducer;
