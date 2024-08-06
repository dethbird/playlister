import React from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Container,
  Grid,
  MantineProvider,
} from '@mantine/core';
import {
  IconMoodWrrr
} from '@tabler/icons-react';
import { Notifications } from '@mantine/notifications';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { FavoritePlaylists } from './features/favoritePlaylists/FavoritePlaylists';
import { ManagedPlaylists } from './features/managedPlaylists/ManagedPlaylists';
import { ManagedPlaylistsNav } from './features/managedPlaylists/ManagedPlaylistsNav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import { selectStatus } from './features/player/playerSlice';
import { theme } from './app/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.scss';


function App() {

  const playerStatus = useSelector(selectStatus);

  const renderBody = () => {
    if (!window.spotifyUser.display_name) {
      return (
        <LoginScreen />
      );
    } else if (playerStatus === 'rejected') {
      // This is for potential server errors. Either Spotify token or session expired
      return (
        <Container size='md' m='xl' p='xl'>
          <Nav spotifyUser={{}} />
          <Alert variant="light" color="grape" title="Uh oh, something went wrong." icon={<IconMoodWrrr />}>
            Please try refreshing the page later.
          </Alert>
        </Container>
      );
    } else {
      return (
        <>
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
        </>
      );
    }
  }
  return (
    <MantineProvider theme={theme} >
      <Container>
        {renderBody()}
      </Container>
      <Container p='xl' ta='center' fw={300}>
        <footer>&copy; {new Date().getFullYear()} Playlister.</footer>
      </Container>
    </MantineProvider>
  );
}

export default App;

