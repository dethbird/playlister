import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import spotifyPlaylistsReducer from '../features/spotifyPlaylists/spotifyPlaylistsSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    spotifyPlaylists: spotifyPlaylistsReducer
  },
});
