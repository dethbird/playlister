import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Container,
  Grid,
  MantineProvider,
  useMantineColorScheme
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
import { getUser, selectUser } from './features/user/userSlice';
import { theme } from './app/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.scss';


// wrapper around app body but within theme provider for changing themes
export function AppBody(props) {
  const user = useSelector(selectUser);
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(user.theme ? user.theme : 'dark');
  }, [user, setColorScheme]);

  return (
    <>
      {props.children}
    </>
  )
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

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
      <AppBody>
        <Container>
          {renderBody()}
        </Container>
        <Container p='xl' ta='center' fw={400}>
          <footer >&copy; {new Date().getFullYear()} Playlister.</footer>
        </Container>
      </AppBody>
    </MantineProvider>
  );
}

export default App;
