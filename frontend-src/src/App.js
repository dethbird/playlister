import React from 'react';
// import { Counter } from './features/counter/Counter';
import Nav from './components/Nav';
import './App.css';

function App() {

  return (
    <div className="App">
      <Nav spotifyUser={window.spotifyUser} />
      {/* <Counter /> */}
    </div>
  );
}

export default App;

