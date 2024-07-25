import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
  async ({limit, offset}) => {
    const response = await fetch(`/playlists/spotify?limit=${limit}&offset=${offset}`);
    const data = await response.json();
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
