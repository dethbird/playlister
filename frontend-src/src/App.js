import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Container,
  createTheme,
  MantineProvider,
  rem
} from '@mantine/core';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { FavoritePlaylists } from './features/favoritePlaylists/FavoritePlaylists';
import { ManagedPlaylists } from './features/managedPlaylists/ManagedPlaylists';
import { ManagedPlaylistsNav } from './features/managedPlaylists/ManagedPlaylistsNav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import './App.scss';
import '@mantine/core/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  defaultGradient: {
    from: 'orange',
    to: 'red',
    deg: 45,
  },
  fontSizes: {
    xs: rem(10),
    sm: rem(11),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  }
});

function App() {
  if (!window.spotifyUser.display_name) {
    return <LoginScreen />;
  }

  return (
    <MantineProvider theme={theme}>
      <Container>
        <ToastContainer autoClose={1500} />
        <Nav spotifyUser={window.spotifyUser} />
        <div className="row">
          <div className="col-xs-6">
            <Player />
          </div>
          <div className="col-xs-6">
            <ManagedPlaylistsNav />
          </div>
        </div>
        <SpotifyPlaylists spotifyUser={window.spotifyUser} />
        <FavoritePlaylists />
        <ManagedPlaylists />
      </Container>
    </MantineProvider>
  );
}

export default App;

