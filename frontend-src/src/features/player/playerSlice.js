import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentlyPlaying } from './playerAPI';

const initialState = {
  currentTrack: null,
  status: 'idle',
  error: null
};

export const getCurrentTrack = createAsyncThunk(
  'player/getCurrentTrack',
  async () => {
    const response = await getCurrentlyPlaying();
    return response.data;
  }
);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentTrack.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getCurrentTrack.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.currentTrack = action.payload;
      })
      .addCase(getCurrentTrack.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      });;
  },
});



export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectStatus = (state) => state.player.status;
export const selectError = (state) => state.player.error;



export default playerSlice.reducer;
