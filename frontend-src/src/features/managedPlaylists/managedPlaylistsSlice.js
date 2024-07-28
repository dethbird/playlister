import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [],
  playlistsMeta: {},
  status: 'idle',
  error: null
};

export const getManagedPlaylists = createAsyncThunk(
  'playlists/getManaged',
  async () => {
    const response = await fetch(`/playlists`);
    const data = await response.json();
    return data;
  }
);

export const getPlaylistMeta = createAsyncThunk(
  'playlists/getMeta',
  async (spotifyPlaylistId) => {
    const response = await fetch(
      `/playlists/spotify/${spotifyPlaylistId}?fields=id,images,tracks(total),name,description`
    );
    const data = await response.json();
    return data;
  }
);

export const removeManagedPlaylist = createAsyncThunk(
  'playlists/removeManaged',
  async (managedPlaylistId, { dispatch }) => {
    const response = await fetch(
      `/playlists/${managedPlaylistId}`,
      {
        method: 'DELETE'
      }
    );
    dispatch(getManagedPlaylists());
    const data = await response.json();
    return data;
  }
);


export const managedPlaylistsSlice = createSlice({
  name: 'managedPlaylists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getManagedPlaylists.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getManagedPlaylists.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.playlists = action.payload;
      })
      .addCase(getManagedPlaylists.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      })
      .addCase(getPlaylistMeta.fulfilled, (state, action) => {
        state.playlistsMeta[action.payload.id] = action.payload;
      });
  },
});


export const selectPlaylists = (state) => state.managedPlaylists.playlists;
export const selectPlaylistsMeta = (state) => state.managedPlaylists.playlistsMeta;
export const selectStatus = (state) => state.managedPlaylists.status;
export const selectError = (state) => state.managedPlaylists.error;



export default managedPlaylistsSlice.reducer;
