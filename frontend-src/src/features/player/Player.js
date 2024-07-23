import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCurrentTrack,
  play,
  pause,
  previous,
  next,
  selectCurrentTrack,
  selectIsPlaying,
  selectStatus
} from './playerSlice';
// import styles from './Counter.module.css';

export function Player() {

  const currentTrack = useSelector(selectCurrentTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentTrack());
  }, [dispatch]);

  if (status === 'rejected') {
    return <div>Error...</div>;
  }

  if (['pending', 'idle'].includes(status)) {
    return <div>Loading...</div>;
  }

  if (Object.keys(currentTrack).length === 0) {
    return <div>Nothing is playing.</div>
  }

  return (
    <div>
      <pre>{currentTrack.item.uri}</pre>
      <img src={currentTrack.item.album.images[1].url} />
      <h3>{ currentTrack.item.name}</h3>
      <h4>{ currentTrack.item.artists[0].name}</h4>
      <h5>{ currentTrack.item.album.release_date}</h5>
      <button>Like/Unlike</button>
      <button onClick={() => dispatch(play())} disabled={isPlaying}>Play</button>
      <button onClick={() => dispatch(pause())} disabled={!isPlaying}>Pause</button>
      <button onClick={() => dispatch(previous())}>Prev</button>
      <button onClick={() => dispatch(next())}>Next</button>
    </div>
  );
}
