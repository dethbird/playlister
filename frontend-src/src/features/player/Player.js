import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon, Card, Image, Text } from '@mantine/core';
import {
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconPlayerPause,
  IconPlayerPlay,
} from '@tabler/icons-react';
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
      <Card
        className='CurrentlyPlaying'
        shadow="sm"
        padding="md"
      >
        <Card.Section>
          <Image
            radius="md"
            src={currentTrack.item.album.images[1].url}
            className="AlbumArt"
            w={150}
            h="auto"
            fit="contain"
          />
          <div className="AlbumInfo">
            <Text fw={700}>{currentTrack.item.name}</Text>
            <Text fw={500}>{currentTrack.item.album.name}</Text>
            <Text fw={300}>{currentTrack.item.artists[0].name}</Text>
            <Text fw={100}>{currentTrack.item.album.release_date}</Text>
          </div>
        </Card.Section>
        <footer>
          <div className="PlayerControls" role="group">
            <LikeButton trackId={currentTrack.item.id} />
            <ActionIcon aria-label="Pause" onClick={() => dispatch(play())} disabled={isPlaying}>
              <IconPlayerPlay style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
            <ActionIcon aria-label="Pause" onClick={() => dispatch(pause())} disabled={!isPlaying}>
              <IconPlayerPause style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
            <ActionIcon aria-label="Previous Track" onClick={() => dispatch(previous())}>
              <IconPlayerTrackPrev style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
            <ActionIcon aria-label="Next Track" onClick={() => dispatch(next())}>
              <IconPlayerTrackNext style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          </div>
        </footer>
      </Card>
    </div>
  );
}
