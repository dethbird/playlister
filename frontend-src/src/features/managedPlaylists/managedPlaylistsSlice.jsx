import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { apiRequest } from '../../app/apiConfig';
import { selectCurrentTrack } from '../player/playerSlice';
import { theme } from '../../app/theme';

export const initialState = {
  playlists: [],
  playlistsMeta: {},
  favoriteDialogIsOpen: false,
  favoritePlaylists: [],
  status: 'idle',
  favoriteStatus: 'idle',
  error: null
};

const trackAddedNotification = {
  message: <Title order={5} style={{ color: 'white' }}>Track added</Title>,
  color: 'green',
  style: { backgroundColor: theme.colors.green[7] },
};
const trackRemovedNotification = {
  message: <Title order={5} style={{ color: 'white' }}>Track removed</Title>,
  color: 'red',
  style: { backgroundColor: theme.colors.red[7] },
};

export const getManagedPlaylists = createAsyncThunk(
  'playlists/getManaged',
  async () => {
    const response = await apiRequest(`/playlists`);
    const data = await response.json();
    return data;
  }
);

export const getPlaylistMeta = createAsyncThunk(
  'playlists/getMeta',
  async (spotifyPlaylistId) => {
    const response = await apiRequest(
      `/playlists/spotify/${spotifyPlaylistId}?fields=id,images,tracks(total),name,description,uri`
    );
    const data = await response.json();
    return data;
  }
);

export const removeManagedPlaylist = createAsyncThunk(
  'playlists/removeManaged',
  async (managedPlaylistId, { dispatch }) => {
    const response = await apiRequest(
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
    const response = await apiRequest(
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
    const response = await apiRequest(
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
    const response = await apiRequest(
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

export const reorderPlaylists = createAsyncThunk(
  'playlists/reorderPlaylists',
  async (ids, { dispatch }) => {
    const response = await apiRequest(
      `/playlists/reorder`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
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
    return apiRequest(
      `/playlists/add-track-to-active`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri })
      }
    )
      .then(response => response.json())
      .then(data => {
        const playlists = selectPlaylists(getState());
        notifications.show(trackAddedNotification);
        // Refresh meta for active playlists after the request succeeds
        playlists.forEach(playlist => {
          if (playlist.active === 'Y') {
            dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
          }
        });
        return data;
      });
  }
);

export const removeTrackFromActive = createAsyncThunk(
  'playlists/removeTrackFromActive',
  async (uri, { dispatch, getState }) => {
    return apiRequest(
      `/playlists/remove-track-from-active`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri })
      }
    )
      .then(response => response.json())
      .then(data => {
        const playlists = selectPlaylists(getState());
        notifications.show(trackRemovedNotification);
        // Refresh meta for active playlists after the request succeeds
        playlists.forEach(playlist => {
          if (playlist.active === 'Y') {
            dispatch(getPlaylistMeta(playlist.spotify_playlist_id));
          }
        });
        return data;
      });
  }
);

export const addTrackToPlaylist = createAsyncThunk(
  'playlists/addTrackToPlaylist',
  async (spotifyPlaylistId, { dispatch, getState }) => {
    const currentTrack = selectCurrentTrack(getState());
    return apiRequest(
      `/playlists/spotify/${spotifyPlaylistId}/add-track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: currentTrack.item.uri })
      }
    )
      .then(response => response.json())
      .then(data => {
        notifications.show(trackAddedNotification);
        dispatch(getPlaylistMeta(spotifyPlaylistId));
        return data;
      });
  }
);

export const removeTrackFromPlaylist = createAsyncThunk(
  'playlists/removeTrackFromPlaylist',
  async (spotifyPlaylistId, { dispatch, getState }) => {
    const currentTrack = selectCurrentTrack(getState());
    return apiRequest(
      `/playlists/spotify/${spotifyPlaylistId}/remove-track`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: currentTrack.item.uri })
      }
    )
      .then(response => response.json())
      .then(data => {
        notifications.show(trackRemovedNotification);
        dispatch(getPlaylistMeta(spotifyPlaylistId));
        return data;
      });
  }
);

export const toggleFavoritePlaylist = createAsyncThunk(
  'playlists/toggleFavorite',
  async (spotifyPlaylistId, { dispatch }) => {
    return apiRequest(`/playlists/favorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    })
      .then(response => response.json())
      // ensure we refresh managed & favorite lists after the request settles
      .finally(() => {
        try {
          dispatch(getManagedPlaylists());
          dispatch(getFavoritePlaylists());
        } catch (e) {
          // swallow dispatch errors here; createAsyncThunk will surface request errors
          // but we don't want follow-up dispatch failures to break the original flow
          // (this is defensive; dispatch should not normally throw)
        }
      });
  }
);

export const getFavoritePlaylists = createAsyncThunk(
  'playlists/getFavoritePlaylists',
  async () => {
    const response = await apiRequest(`/playlists/favorite`);
    const data = await response.json();
    return data;
  }
);

export const addFavoritePlaylistToManaged = createAsyncThunk(
  'playlists/addFavoriteToManaged',
  async (spotifyPlaylistId, { dispatch }) => {
    return apiRequest(`/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: spotifyPlaylistId })
    })
      .then(response => response.json())
      .then(data => {
        // refresh managed playlists and close the favorites dialog after success
        dispatch(managedPlaylistsSlice.actions.toggleFavoriteDialog());
        dispatch(getManagedPlaylists());
        return data;
      });
  }
);



export const managedPlaylistsSlice = createSlice({
  name: 'managedPlaylists',
  initialState,
  reducers: {
    toggleFavoriteDialog: (state, _action) => {
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
        state.error = action.error;
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
        state.error = action.error;
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
