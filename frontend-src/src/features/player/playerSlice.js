import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  status: 'idle',
  error: null
};

export const getCurrentTrack = createAsyncThunk(
  'player/getCurrentTrack',
  async () => {
    const response = await fetch('/player/currently-playing');
    const data = await response.json();
    return data;
  }
);

export const play = createAsyncThunk(
  'player/play',
  async () => {
    const response = await fetch('/player/play', { method: 'PUT' });
    const data = await response.json();
    return data;
  }
);

export const pause = createAsyncThunk(
  'player/pause',
  async () => {
    const response = await fetch('/player/pause', { method: 'PUT' });
    const data = await response.json();
    return data;
  }
);

export const previous = createAsyncThunk(
  'player/previous',
  async (_, { dispatch }) => {
    const response = await fetch('/player/previous', { method: 'POST' });
    const data = await response.json();
    setTimeout(() => {dispatch(getCurrentTrack())}, 250);
    return data;
  }
);

export const next = createAsyncThunk(
  'player/next',
  async (_, { dispatch }) => {
    const response = await fetch('/player/next', { method: 'POST' });
    const data = await response.json();
    setTimeout(() => {dispatch(getCurrentTrack())}, 250);
    return data;
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
        state.isPlaying = action.payload.is_playing;
      })
      .addCase(getCurrentTrack.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      })
      .addCase(play.fulfilled, (state, action) => {
        state.isPlaying = true;
      })
      .addCase(pause.fulfilled, (state, action) => {
        state.isPlaying = false;
      });
  },
});



export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectStatus = (state) => state.player.status;
export const selectError = (state) => state.player.error;



export default playerSlice.reducer;
