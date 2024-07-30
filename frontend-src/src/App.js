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
  },
  // primaryColor: 'bright-pink',
  colors: {
    'red': [
      "#fbeff2",
      "#f1dbe1",
      "#e5b2c0",
      "#d9879d",
      "#d06380",
      "#ca4d6d",
      "#c84164",
      "#b23454",
      "#9e2c4b",
      "#8c223f"
    ],
    'green': [
      "#effbf3",
      "#dff4e6",
      "#b7e8c9",
      "#8fdcaa",
      "#6dd38f",
      "#59cc7f",
      "#4dca76",
      "#3eb264",
      "#339e58",
      "#258949"
    ]
  },
});



function App() {
  if (!window.spotifyUser.display_name) {
    return <LoginScreen />;
  }

  return (
    <MantineProvider theme={theme}>
      <Container>
        <Notifications position="top-right" autoClose={1500} />
        <Nav spotifyUser={window.spotifyUser} />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Player />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
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

