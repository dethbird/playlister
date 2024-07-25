import React from 'react';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import { SpotifyPlaylists } from './features/spotifyPlaylists/SpotifyPlaylists';
import './App.css';

function App() {
  if (!window.spotifyUser.display_name) {
    return <LoginScreen />;
  }

  return (
    <div className="App">
      <Nav spotifyUser={window.spotifyUser} />
      <Player />
      <SpotifyPlaylists spotifyUser={window.spotifyUser} />
    </div>
  );
}

export default App;

