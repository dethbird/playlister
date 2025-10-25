import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';
import { getManagedPlaylists } from '../managedPlaylists/managedPlaylistsSlice';

export const initialState = {
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
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 250);
    return data;
  }
);

export const getAllSpotifyPlaylists = createAsyncThunk(
  'playlists/spotify/all',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/playlists/spotify/all');
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to fetch' }));
        return rejectWithValue(err);
      }
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue({ message: e.message || 'Network error' });
    }
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
    setTimeout(() => {
      dispatch(spotifyPlaylistsSlice.actions.toggleDialog());
      dispatch(getManagedPlaylists());
    }, 250);
    return data;
  }
);


export const spotifyPlaylistsSlice = createSlice({
  name: 'spotifyPlaylists',
  initialState,
  reducers: {
    toggleDialog: (state, action) => {
      state.dialogIsOpen = !state.dialogIsOpen;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
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
      .addCase(getAllSpotifyPlaylists.pending, (state) => {
        // keep a separate status if desired
        state.status = 'pending';
      })
      .addCase(getAllSpotifyPlaylists.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        // persist consolidated playlists to localStorage for selector usage
        try {
          if (action.payload) {
            // store the whole payload (total, limit, items) under a stable key
            localStorage.setItem('allSpotifyPlaylists', JSON.stringify(action.payload));
          }
        } catch (e) {
          // ignore localStorage failures
          // eslint-disable-next-line no-console
          console.warn('Failed to save playlists to localStorage', e);
        }
      })
      .addCase(getSpotifyPlaylists.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      });
  },
});

export const { toggleDialog } = spotifyPlaylistsSlice.actions;

// additional pagination actions
export const { setLimit, setOffset } = spotifyPlaylistsSlice.actions;

export const selectCurrentPage = (state) => state.spotifyPlaylists.currentPage;
export const selectdDialogIsOpen = (state) => state.spotifyPlaylists.dialogIsOpen;
export const selectStatus = (state) => state.spotifyPlaylists.status;
export const selectError = (state) => state.spotifyPlaylists.error;

export const selectLimit = (state) => state.spotifyPlaylists.limit;
export const selectOffset = (state) => state.spotifyPlaylists.offset;

export const selectAllPlaylists = () => {
  try {
    const raw = localStorage.getItem('allSpotifyPlaylists');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read allSpotifyPlaylists from localStorage', e);
    return null;
  }
};



export default spotifyPlaylistsSlice.reducer;
