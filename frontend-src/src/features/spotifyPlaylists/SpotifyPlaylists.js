/**
 * This is basically a container that manages the open and closed state of the paginated list of a user's spotify playlists
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  toggleDialog,
} from './spotifyPlaylistsSlice';
import { SpotifyPlaylistsList } from './SpotifyPlaylistsList';

export function SpotifyPlaylists( { spotifyUser }) {

  const dispatch = useDispatch();

  return (
    <div className='container'>
      <div><button onClick={() => dispatch(toggleDialog())} >Add a playlist to manage</button></div>
      <SpotifyPlaylistsList  spotifyUser={ spotifyUser }/>
    </div>
  );
}
