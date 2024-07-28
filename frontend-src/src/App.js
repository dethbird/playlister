import React from 'react';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { ManagedPlaylists } from './features/managedPlaylists/ManagedPlaylists';
import { ManagedPlaylistsNav } from './features/managedPlaylists/ManagedPlaylistsNav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import './App.scss';

function App() {
  if (!window.spotifyUser.display_name) {
    return <LoginScreen />;
  }

  return (
    <div className="App container">
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
      <ManagedPlaylists />
    </div>
  );
}

export default App;

