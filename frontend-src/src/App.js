import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { FavoritePlaylists } from './features/favoritePlaylists/FavoritePlaylists';
import { ManagedPlaylists } from './features/managedPlaylists/ManagedPlaylists';
import { ManagedPlaylistsNav } from './features/managedPlaylists/ManagedPlaylistsNav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import { getUser, selectUser } from './features/user/userSlice';
import { theme } from './app/theme';
import './App.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';


function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const renderBody = () => {
    if (!window.spotifyUser.display_name || Object.keys(user).length === 0) {
      return (
        <LoginScreen />
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
    <MantineProvider theme={theme} defaultColorScheme={user.theme}>
      <Container>
        { renderBody() }
      </Container>
      <Container p='xl' ta='center' fw={300}>
        <footer>&copy; {new Date().getFullYear()} Playlister.</footer>
      </Container>
    </MantineProvider>
  );
}

export default App;

