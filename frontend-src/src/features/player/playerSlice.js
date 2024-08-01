import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';

const initialState = {
  currentTrack: {},
  isPlaying: false,
  isLiked: false,
  status: 'idle',
  error: null
};

export const getCurrentTrack = createAsyncThunk(
  'player/getCurrentTrack',
  async () => {
    const response = await apiRequest('/player/currently-playing');
    const data = await response.json();
    return data;
  }
);

export const play = createAsyncThunk(
  'player/play',
  async () => {
    const response = await apiRequest('/player/play', { method: 'PUT' });
    const data = await response.json();
    return data;
  }
);

export const pause = createAsyncThunk(
  'player/pause',
  async () => {
    const response = await apiRequest('/player/pause', { method: 'PUT' });
    const data = await response.json();
    return data;
  }
);

export const previous = createAsyncThunk(
  'player/previous',
  async (_, { dispatch }) => {
    const response = await apiRequest('/player/previous', { method: 'POST' });
    const data = await response.json();
    setTimeout(() => { dispatch(getCurrentTrack()) }, 250);
    return data;
  }
);

export const next = createAsyncThunk(
  'player/next',
  async (_, { dispatch }) => {
    const response = await apiRequest('/player/next', { method: 'POST' });
    const data = await response.json();
    setTimeout(() => { dispatch(getCurrentTrack()) }, 250);
    return data;
  }
);

// this app only deals with one track at a time
export const liked = createAsyncThunk(
  'player/liked',
  async (trackId) => {
    const response = await apiRequest('/player/liked?ids=' + trackId);
    const data = await response.json();
    return data[0];
  }
);

export const like = createAsyncThunk(
  'player/like',
  async (trackId) => {
    const response = await apiRequest('/player/like?ids=' + trackId, {
      method: 'PUT'
    });
    const data = await response.json();
    return data;
  }
);

export const unlike = createAsyncThunk(
  'player/unlike',
  async (trackId) => {
    const response = await apiRequest('/player/unlike?ids=' + trackId, {
      method: 'DELETE'
    });
    const data = await response.json();
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
        // state.currentTrack = null;
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
      })
      .addCase(liked.fulfilled, (state, action) => {
        state.isLiked = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.isLiked = true;
      })
      .addCase(unlike.fulfilled, (state, action) => {
        state.isLiked = false;
      });
  },
});



export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectIsLiked = (state) => state.player.isLiked;
export const selectStatus = (state) => state.player.status;
export const selectError = (state) => state.player.error;



export default playerSlice.reducer;
