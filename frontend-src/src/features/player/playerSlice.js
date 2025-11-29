import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';

export const initialState = {
  currentTrack: {},
  isPlaying: false,
  isLiked: false,
  status: 'idle',
  error: null,
  // Artist info state
  artistInfo: null,
  artistInfoStatus: 'idle',
  artistInfoError: null,
  // Album info state
  albumInfo: null,
  albumInfoStatus: 'idle',
  albumInfoError: null,
  // Last.fm artist info state
  lastfmArtistInfo: null,
  lastfmArtistInfoStatus: 'idle',
  lastfmArtistInfoError: null,
  // Last.fm album info state
  lastfmAlbumInfo: null,
  lastfmAlbumInfoStatus: 'idle',
  lastfmAlbumInfoError: null
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
  async (_, { dispatch, getState }) => {
    const currentTrack = getState().player.currentTrack;
    const currentTrackId = currentTrack?.item?.id;
    
    const response = await apiRequest('/player/previous', { method: 'POST' });
    const data = await response.json();
    
    // Retry logic to ensure track actually changed.
    // Use an async loop with a sleep promise instead of setTimeout callbacks.
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    for (let i = 0; i < 5; i++) {
      // wait 1s before checking
      await sleep(1000);
      await dispatch(getCurrentTrack());
      const newTrackId = getState().player.currentTrack?.item?.id;
      if (newTrackId && newTrackId !== currentTrackId) {
        break;
      }
    }
    return data;
  }
);

export const next = createAsyncThunk(
  'player/next',
  async (_, { dispatch, getState }) => {
    const currentTrack = getState().player.currentTrack;
    const currentTrackId = currentTrack?.item?.id;
    
    const response = await apiRequest('/player/next', { method: 'POST' });
    const data = await response.json();
    
    // Retry logic to ensure track actually changed.
    // Use an async loop with a sleep promise instead of setTimeout callbacks.
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    for (let i = 0; i < 5; i++) {
      // wait 1s before checking
      await sleep(1000);
      await dispatch(getCurrentTrack());
      const newTrackId = getState().player.currentTrack?.item?.id;
      if (newTrackId && newTrackId !== currentTrackId) {
        break;
      }
    }
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

export const getArtistInfo = createAsyncThunk(
  'player/getArtistInfo',
  async (artistId) => {
    const response = await apiRequest('/player/artist/' + artistId);
    const data = await response.json();
    return data;
  }
);

export const getAlbumInfo = createAsyncThunk(
  'player/getAlbumInfo',
  async (albumId) => {
    const response = await apiRequest('/player/album/' + albumId);
    const data = await response.json();
    return data;
  }
);

export const getLastfmArtistInfo = createAsyncThunk(
  'player/getLastfmArtistInfo',
  async (artistName) => {
    const response = await apiRequest('/player/lastfm/artist?artist=' + encodeURIComponent(artistName));
    const data = await response.json();
    return data;
  }
);

export const getLastfmAlbumInfo = createAsyncThunk(
  'player/getLastfmAlbumInfo',
  async ({ artistName, albumName }) => {
    const response = await apiRequest('/player/lastfm/album?artist=' + encodeURIComponent(artistName) + '&album=' + encodeURIComponent(albumName));
    const data = await response.json();
    return data;
  }
);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    clearArtistInfo: (state) => {
      state.artistInfo = null;
      state.artistInfoStatus = 'idle';
      state.artistInfoError = null;
    },
    clearAlbumInfo: (state) => {
      state.albumInfo = null;
      state.albumInfoStatus = 'idle';
      state.albumInfoError = null;
    },
    clearTrackInfoModal: (state) => {
      state.artistInfo = null;
      state.artistInfoStatus = 'idle';
      state.artistInfoError = null;
      state.albumInfo = null;
      state.albumInfoStatus = 'idle';
      state.albumInfoError = null;
      state.lastfmArtistInfo = null;
      state.lastfmArtistInfoStatus = 'idle';
      state.lastfmArtistInfoError = null;
      state.lastfmAlbumInfo = null;
      state.lastfmAlbumInfoStatus = 'idle';
      state.lastfmAlbumInfoError = null;
    },
    clearLastfmArtistInfo: (state) => {
      state.lastfmArtistInfo = null;
      state.lastfmArtistInfoStatus = 'idle';
      state.lastfmArtistInfoError = null;
    },
    clearLastfmAlbumInfo: (state) => {
      state.lastfmAlbumInfo = null;
      state.lastfmAlbumInfoStatus = 'idle';
      state.lastfmAlbumInfoError = null;
    }
  },
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
        state.error = action.error;
      })
      .addCase(play.fulfilled, (state, _action) => {
        state.isPlaying = true;
      })
      .addCase(pause.fulfilled, (state, _action) => {
        state.isPlaying = false;
      })
      .addCase(liked.fulfilled, (state, action) => {
        state.isLiked = action.payload;
      })
      .addCase(like.fulfilled, (state, _action) => {
        state.isLiked = true;
      })
      .addCase(unlike.fulfilled, (state, _action) => {
        state.isLiked = false;
      })
      .addCase(getArtistInfo.pending, (state) => {
        state.artistInfoStatus = 'pending';
        state.artistInfoError = null;
      })
      .addCase(getArtistInfo.fulfilled, (state, action) => {
        state.artistInfoStatus = 'fulfilled';
        state.artistInfo = action.payload;
      })
      .addCase(getArtistInfo.rejected, (state, action) => {
        state.artistInfoStatus = 'rejected';
        state.artistInfoError = action.error;
      })
      .addCase(getAlbumInfo.pending, (state) => {
        state.albumInfoStatus = 'pending';
        state.albumInfoError = null;
      })
      .addCase(getAlbumInfo.fulfilled, (state, action) => {
        state.albumInfoStatus = 'fulfilled';
        state.albumInfo = action.payload;
      })
      .addCase(getAlbumInfo.rejected, (state, action) => {
        state.albumInfoStatus = 'rejected';
        state.albumInfoError = action.error;
      })
      .addCase(getLastfmArtistInfo.pending, (state) => {
        state.lastfmArtistInfoStatus = 'pending';
        state.lastfmArtistInfoError = null;
      })
      .addCase(getLastfmArtistInfo.fulfilled, (state, action) => {
        state.lastfmArtistInfoStatus = 'fulfilled';
        state.lastfmArtistInfo = action.payload;
      })
      .addCase(getLastfmArtistInfo.rejected, (state, action) => {
        state.lastfmArtistInfoStatus = 'rejected';
        state.lastfmArtistInfoError = action.error;
      })
      .addCase(getLastfmAlbumInfo.pending, (state) => {
        state.lastfmAlbumInfoStatus = 'pending';
        state.lastfmAlbumInfoError = null;
      })
      .addCase(getLastfmAlbumInfo.fulfilled, (state, action) => {
        state.lastfmAlbumInfoStatus = 'fulfilled';
        state.lastfmAlbumInfo = action.payload;
      })
      .addCase(getLastfmAlbumInfo.rejected, (state, action) => {
        state.lastfmAlbumInfoStatus = 'rejected';
        state.lastfmAlbumInfoError = action.error;
      });
  },
});

export const { clearArtistInfo, clearAlbumInfo, clearTrackInfoModal, clearLastfmArtistInfo, clearLastfmAlbumInfo } = playerSlice.actions;

export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectIsLiked = (state) => state.player.isLiked;
export const selectStatus = (state) => state.player.status;
export const selectError = (state) => state.player.error;
export const selectArtistInfo = (state) => state.player.artistInfo;
export const selectArtistInfoStatus = (state) => state.player.artistInfoStatus;
export const selectArtistInfoError = (state) => state.player.artistInfoError;
export const selectAlbumInfo = (state) => state.player.albumInfo;
export const selectAlbumInfoStatus = (state) => state.player.albumInfoStatus;
export const selectAlbumInfoError = (state) => state.player.albumInfoError;
export const selectLastfmArtistInfo = (state) => state.player.lastfmArtistInfo;
export const selectLastfmArtistInfoStatus = (state) => state.player.lastfmArtistInfoStatus;
export const selectLastfmArtistInfoError = (state) => state.player.lastfmArtistInfoError;
export const selectLastfmAlbumInfo = (state) => state.player.lastfmAlbumInfo;
export const selectLastfmAlbumInfoStatus = (state) => state.player.lastfmAlbumInfoStatus;
export const selectLastfmAlbumInfoError = (state) => state.player.lastfmAlbumInfoError;



export default playerSlice.reducer;
