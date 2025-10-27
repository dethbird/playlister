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

// Cache TTL for allSpotifyPlaylists in milliseconds (1 minute)
const ALL_PLAYLISTS_TTL = 60 * 1000;

export const getSpotifyPlaylists = createAsyncThunk(
  'playlists/spotify',
  async ({ limit, offset }) => {
    const response = await apiRequest(`/playlists/spotify?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    // schedule a microtask to scroll to top after the promise resolves
    // (avoids brittle setTimeout delays while ensuring this runs after the thunk finishes)
    Promise.resolve().then(() => {
      try {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (e) {
        // ignore errors in environments without window
      }
    });
    return data;
  }
);

export const getAllSpotifyPlaylists = createAsyncThunk(
  'playlists/spotify/all',
  async (_, { rejectWithValue }) => {
    try {
      // try using cached data if present and fresh
      try {
        const raw = localStorage.getItem('allSpotifyPlaylists');
        if (raw) {
          const parsed = JSON.parse(raw);
          // support both legacy shape (payload only) and new shape { payload, savedAt }
          const payload = parsed.payload !== undefined ? parsed.payload : parsed;
          const savedAt = parsed.savedAt || null;
          if (savedAt && (Date.now() - savedAt) < ALL_PLAYLISTS_TTL) {
            return payload;
          }
        }
      } catch (e) {
        // ignore localStorage parsing errors and fall through to network request
      }

      const response = await apiRequest('/playlists/spotify/all');
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to fetch' }));
        return rejectWithValue(err);
      }
      const data = await response.json();
      // persist to localStorage with timestamp (only on real network fetch)
      try {
        localStorage.setItem('allSpotifyPlaylists', JSON.stringify({ payload: data, savedAt: Date.now() }));
      } catch (e) {
        // ignore localStorage failures
      }
      return data;
    } catch (e) {
      return rejectWithValue({ message: e.message || 'Network error' });
    }
  }
);

export const addSpotifyPlaylistToManaged = createAsyncThunk(
  'playlists/addToManaged',
  async (spotifyPlaylistId, { dispatch }) => {
    // Use promise chaining so follow-up dispatches run after the API promise resolves
    return apiRequest(`/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    })
      .then(response => response.json())
      .then(data => {
        try {
          dispatch(spotifyPlaylistsSlice.actions.toggleDialog());
          dispatch(getManagedPlaylists());
        } catch (e) {
          // defensive: swallow dispatch errors; calling code will see request errors via the returned promise
        }
        return data;
      });
  }
);


export const spotifyPlaylistsSlice = createSlice({
  name: 'spotifyPlaylists',
  initialState,
  reducers: {
    toggleDialog: (state, _action) => {
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
      .addCase(getAllSpotifyPlaylists.fulfilled, (state) => {
        state.status = 'fulfilled';
        // no-op here: persistence happens in the thunk on cache-miss to avoid overwriting savedAt
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
    const parsed = JSON.parse(raw);
    // support both legacy shape (payload only) and new shape { payload, savedAt }
    return parsed.payload !== undefined ? parsed.payload : parsed;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read allSpotifyPlaylists from localStorage', e);
    return null;
  }
};



export default spotifyPlaylistsSlice.reducer;
