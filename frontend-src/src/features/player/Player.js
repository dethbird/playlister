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
import { LikeButton } from './LikeButton';

let refreshTimer;

export function Player() {

  const currentTrack = useSelector(selectCurrentTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentTrack());

    const refreshTrack = () => {
      dispatch(getCurrentTrack());
    }

    // refresh on focus
    window.addEventListener('focus', refreshTrack);

    return () => {
      window.removeEventListener('focus', refreshTrack);
    };

  }, [dispatch]);

  // prevent setting multiple timers on rerender
  refreshTimer = clearTimeout(refreshTimer);

  if (status === 'rejected') {
    return <div>Error...</div>;
  }

  if (['pending', 'idle'].includes(status) && !currentTrack) {
    return <div aria-busy="true"></div>;
  }

  if (Object.keys(currentTrack).length === 0) {
    return <div>Nothing is playing.</div>
  }

  // only set new timer in fulfilled state.
  if (isPlaying && currentTrack && !refreshTimer) {
    const refreshIn = currentTrack.item.duration_ms - currentTrack.progress_ms + 100;
    refreshTimer = setTimeout(() => { dispatch(getCurrentTrack()) }, refreshIn);
  }

  return (
    <div className="Player">
      <article className='CurrentlyPlaying'>
        <img src={currentTrack.item.album.images[1].url} className="AlbumArt" />
        <div className="AlbumInfo">
          <h3>{currentTrack.item.name}</h3>
          <h4>{currentTrack.item.album.name}</h4>
          <h5>{currentTrack.item.artists[0].name}</h5>
          <h6>{currentTrack.item.album.release_date}</h6>
        </div>
        <footer>
          <div className="PlayerControls" role="group">
            <LikeButton trackId={currentTrack.item.id} />
            <button onClick={() => dispatch(play())} disabled={isPlaying}>Play</button>
            <button onClick={() => dispatch(pause())} disabled={!isPlaying}>Pause</button>
            <button onClick={() => dispatch(previous())}>Prev</button>
            <button onClick={() => dispatch(next())}>Next</button>
          </div>
        </footer>
      </article>
    </div>
  );
}
