import React from 'react';
import { Player } from './features/player/Player';
import LoginScreen from './components/LoginScreen';
import Nav from './components/Nav';
import './App.css';

function App() {

  if (!window.spotifyUser.display_name) {
    return <LoginScreen />;
  }

  return (
    <div className="App">
      <Nav spotifyUser={window.spotifyUser} />
      <Player />
    </div>
  );
}

export default App;

