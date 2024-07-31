import React from 'react';
import {
  Container,
  createTheme,
  Grid,
  MantineProvider,
  rem
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { FavoritePlaylists } from './features/favoritePlaylists/FavoritePlaylists';
import { ManagedPlaylists } from './features/managedPlaylists/ManagedPlaylists';
import { ManagedPlaylistsNav } from './features/managedPlaylists/ManagedPlaylistsNav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import './App.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  defaultGradient: {
    from: 'green',
    to: 'red',
    deg: 45,
  },
  fontSizes: {
    xs: rem(10),
    sm: rem(11),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  },
  primaryColor: 'pale-purple',
  colors: {
    'red': [
      "#ffe8fc",
      "#ffd0f0",
      "#fd9edc",
      "#fa69c8",
      "#f83eb8",
      "#f722ad",
      "#f711a8",
      "#dd0193",
      "#c50083",
      "#ae0072"
    ],
    'green': [
      "#e2ffeb",
      "#ccffda",
      "#9bfeb7",
      "#66fb90",
      "#3afa70",
      "#1dfa5b",
      "#02f94f",
      "#00de3e",
      "#00c635",
      "#00aa28"
    ],
    'pale-purple': [
      "#f2f0ff",
      "#e0dff2",
      "#bfbdde",
      "#9b98ca",
      "#7d79ba",
      "#6a65b0",
      "#605bac",
      "#504c97",
      "#464388",
      "#3b3979"
    ]
  },
});



function App() {
  if (!window.spotifyUser.display_name) {
    return (
      <MantineProvider theme={theme}>
        <Container>
          <LoginScreen />
        </Container>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <Container>
        <Notifications position="top-right" autoClose={1500} />
        <Nav spotifyUser={window.spotifyUser} />
        <Grid>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Player />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <ManagedPlaylistsNav />
          </Grid.Col>
        </Grid>
        <SpotifyPlaylists spotifyUser={window.spotifyUser} />
        <FavoritePlaylists />
        <ManagedPlaylists />
      </Container>
    </MantineProvider>
  );
}

export default App;

