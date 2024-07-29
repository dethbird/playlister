import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';
import { getManagedPlaylists } from '../managedPlaylists/managedPlaylistsSlice';

const initialState = {
  currentPage: null,
  dialogIsOpen: false,
  status: 'idle',
  error: null,
  limit: 25,
  offset: 0
};

export const getSpotifyPlaylists = createAsyncThunk(
  'playlists/spotify',
  async ({ limit, offset }) => {
    const response = await apiRequest(`/playlists/spotify?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
  }
);

export const addSpotifyPlaylistToManaged = createAsyncThunk(
  'playlists/addToManaged',
  async (spotifyPlaylistId, { dispatch }) => {
    const response = await apiRequest(`/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    });
    const data = await response.json();
    dispatch(spotifyPlaylistsSlice.actions.toggleDialog());
    dispatch(getManagedPlaylists());
    return data;
  }
);


export const spotifyPlaylistsSlice = createSlice({
  name: 'spotifyPlaylists',
  initialState,
  reducers: {
    toggleDialog: (state, action) => {
      state.dialogIsOpen = !state.dialogIsOpen;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpotifyPlaylists.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getSpotifyPlaylists.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.currentPage = action.payload;
      })
      .addCase(getSpotifyPlaylists.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      });
  },
});

export const { toggleDialog } = spotifyPlaylistsSlice.actions;

export const selectCurrentPage = (state) => state.spotifyPlaylists.currentPage;
export const selectdDialogIsOpen = (state) => state.spotifyPlaylists.dialogIsOpen;
export const selectStatus = (state) => state.spotifyPlaylists.status;
export const selectError = (state) => state.spotifyPlaylists.error;



export default spotifyPlaylistsSlice.reducer;
