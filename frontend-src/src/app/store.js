import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import managedPlaylistsReducer from '../features/managedPlaylists/managedPlaylistsSlice';
import spotifyPlaylistsReducer from '../features/spotifyPlaylists/spotifyPlaylistsSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    managedPlaylists: managedPlaylistsReducer,
    spotifyPlaylists: spotifyPlaylistsReducer,
    user: userReducer
  },
});
