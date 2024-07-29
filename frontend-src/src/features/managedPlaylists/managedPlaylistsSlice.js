import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectCurrentTrack } from '../player/playerSlice';

const initialState = {
  playlists: [],
  playlistsMeta: {},
  favoriteDialogIsOpen: false,
  favoritePlaylists: [],
  status: 'idle',
  favoriteStatus: 'idle',
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
      `/playlists/spotify/${spotifyPlaylistId}?fields=id,images,tracks(total),name,description,uri`
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

export const togglePlaylistActive = createAsyncThunk(
  'playlists/toggleActive',
  async (managedPlaylistId, { dispatch }) => {
    const response = await fetch(
      `/playlists/${managedPlaylistId}/toggle-active`,
      {
        method: 'PUT'
      }
    );
    dispatch(getManagedPlaylists());
    const data = await response.json();
    return data;
  }
);

export const setActiveAll = createAsyncThunk(
  'playlists/setActiveAll',
  async (active, { dispatch }) => {
    const response = await fetch(
      `/playlists/set-active-all`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      }
    );
    dispatch(getManagedPlaylists());
    const data = await response.json();
    return data;
  }
);

export const invertActiveAll = createAsyncThunk(
  'playlists/invertActiveAll',
  async (_, { dispatch }) => {
    const response = await fetch(
      `/playlists/invert-active-all`,
      {
        method: 'PUT'
      }
    );
    dispatch(getManagedPlaylists());
    const data = await response.json();
    return data;
  }
);

export const addTrackToActive = createAsyncThunk(
  'playlists/addTrackToActive',
  async (uri, { dispatch, getState }) => {
    const response = await fetch(
      `/playlists/add-track-to-active`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri })
      }
    );
    const data = await response.json();
    const playlists = selectPlaylists(getState());
    toast.success('Track added');
    setTimeout(() => {
      playlists.forEach(playlist => {
        if (playlist.active === 'Y') {
          dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
        }
      });
    }, 250);
    return data;
  }
);

export const removeTrackFromActive = createAsyncThunk(
  'playlists/removeTrackFromActive',
  async (uri, { dispatch, getState }) => {
    const response = await fetch(
      `/playlists/remove-track-from-active`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri })
      }
    );
    const data = await response.json();
    const playlists = selectPlaylists(getState());
    toast.error('Track removed');
    setTimeout(() => {
      playlists.forEach(playlist => {
        if (playlist.active === 'Y') {
          dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
        }
      });
    }, 250);
    return data;
  }
);

export const addTrackToPlaylist = createAsyncThunk(
  'playlists/addTrackToPlaylist',
  async (spotifyPlaylistId, { dispatch, getState }) => {
    const currentTrack = selectCurrentTrack(getState());
    const response = await fetch(
      `/playlists/spotify/${spotifyPlaylistId}/add-track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: currentTrack.item.uri })
      }
    );
    const data = await response.json();
    toast.success('Track added');
    setTimeout(() => {
      dispatch(getPlaylistMeta(spotifyPlaylistId));
    }, 250);
    return data;
  }
);

export const removeTrackFromPlaylist = createAsyncThunk(
  'playlists/removeTrackFromPlaylist',
  async (spotifyPlaylistId, { dispatch, getState }) => {
    const currentTrack = selectCurrentTrack(getState());
    const response = await fetch(
      `/playlists/spotify/${spotifyPlaylistId}/remove-track`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: currentTrack.item.uri })
      }
    );
    const data = await response.json();
    toast.error('Track removed');
    setTimeout(() => {
      dispatch(getPlaylistMeta(spotifyPlaylistId));
    }, 250);
    return data;
  }
);

export const toggleFavoritePlaylist = createAsyncThunk(
  'playlists/toggleFavorite',
  async (spotifyPlaylistId, { dispatch }) => {
    const response = await fetch(`/playlists/favorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    });
    const data = await response.json();
    dispatch(getManagedPlaylists());
    return data;
  }
);

export const getFavoritePlaylists = createAsyncThunk(
  'playlists/getFavoritePlaylists',
  async () => {
    const response = await fetch(`/playlists/favorite`);
    const data = await response.json();
    return data;
  }
);

export const addFavoritePlaylistToManaged = createAsyncThunk(
  'playlists/addFavoriteToManaged',
  async (spotifyPlaylistId, { dispatch }) => {
    const response = await fetch(`/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    });
    const data = await response.json();
    dispatch(managedPlaylistsSlice.actions.toggleFavoriteDialog());
    dispatch(getManagedPlaylists());
    return data;
  }
);



export const managedPlaylistsSlice = createSlice({
  name: 'managedPlaylists',
  initialState,
  reducers: {
    toggleFavoriteDialog: (state, action) => {
      state.favoriteDialogIsOpen = !state.favoriteDialogIsOpen;
    }
  },
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
      })
      .addCase(getFavoritePlaylists.pending, (state) => {
        state.favoriteStatus = 'pending';
      })
      .addCase(getFavoritePlaylists.fulfilled, (state, action) => {
        state.favoriteStatus = 'fulfilled';
        state.favoritePlaylists = action.payload;
      })
      .addCase(getFavoritePlaylists.rejected, (state, action) => {
        state.favoriteStatus = 'rejected';
        state.error = action.error.message;
      });
  },
});

export const { toggleFavoriteDialog } = managedPlaylistsSlice.actions;

export const selectPlaylists = (state) => state.managedPlaylists.playlists;
export const selectPlaylistsMeta = (state) => state.managedPlaylists.playlistsMeta;
export const selectFavoriteDialogIsOpen = (state) => state.managedPlaylists.favoriteDialogIsOpen;
export const selectFavoritePlaylists = (state) => state.managedPlaylists.favoritePlaylists;
export const selectFavoriteStatus = (state) => state.managedPlaylists.favoriteStatus;
export const selectStatus = (state) => state.managedPlaylists.status;
export const selectError = (state) => state.managedPlaylists.error;



export default managedPlaylistsSlice.reducer;
