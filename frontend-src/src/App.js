import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';

function App() {

  if (!window.spotifyUser.display_name) {
    return <a href='/auth/spotify'>Login with Spotify</a>;
  }

  return (
    <div className="App">
      <div>
        <span>{window.spotifyUser.display_name}</span>
        <a href="/logout">Logout</a>
      </div>
      <Counter />
    </div>
  );
}

export default App;
