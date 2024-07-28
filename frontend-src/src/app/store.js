import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import managedPlaylistsReducer from '../features/managedPlaylists/managedPlaylistsSlice';
import spotifyPlaylistsReducer from '../features/spotifyPlaylists/spotifyPlaylistsSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    managedPlaylists: managedPlaylistsReducer,
    spotifyPlaylists: spotifyPlaylistsReducer
  },
});
