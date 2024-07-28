import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getManagedPlaylists,
  selectPlaylists,
  selectStatus
} from './managedPlaylistsSlice';

import { ManagedPlaylistItem } from './ManagedPlaylistItem';


export function ManagedPlaylists() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getManagedPlaylists());
  }, [dispatch]);

  const playlists = useSelector(selectPlaylists);
  const status = useSelector(selectStatus);

  const renderItems = () => {

    if (status === 'rejected') {
      return <div>Error...</div>;
    }

    if (['pending', 'idle'].includes(status)) {
      return <div aria-busy="true"></div>;
    }

    return playlists.map(item => {
      return <ManagedPlaylistItem playlist={item} />;
    })
  }

  return (
    <div className='ManagedPlaylists'>
      <div>{renderItems()}</div>
    </div>
  );
}
