import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon, Alert, Card, Container, Group, Image, Text, Tooltip } from '@mantine/core';
import {
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconPlayerPause,
  IconPlayerPlay
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
    return null;
  }

  if (['pending', 'idle'].includes(status) && !currentTrack) {
    return <div aria-busy="true"></div>;
  }

  const sectionTitle = <Text tt='uppercase' ta='left'>Currently Playing</Text>;

  if (Object.keys(currentTrack).length === 0) {
    return (
      <>
        {sectionTitle}
        <Container m='xl'>
          <Alert variant="light" color="grape" title="Nothing is playing" icon={<IconPlayerPlay />}>
            Play something on Spotify on any of your devices then check back here.
          </Alert>
        </Container>
      </>
    )
  }

  // only set new timer in fulfilled state.
  if (isPlaying && currentTrack && !refreshTimer) {
    const refreshIn = currentTrack.item.duration_ms - currentTrack.progress_ms + 100;
    refreshTimer = setTimeout(() => { dispatch(getCurrentTrack()) }, refreshIn);
  }

  return (
    <div className="Player">
      <Text tt='uppercase' ta='left'>Currently Playing</Text>
      <Card
        className='CurrentlyPlaying'
        shadow="sm"
        padding="xl"
        margin="sm"
        withBorder
      >
        <Card.Section>
          <Image
            radius="md"
            src={currentTrack.item.album.images[1].url}
            className="AlbumArt"
            w={150}
            h="auto"
            fit="cover"
          />
          <div className="AlbumInfo">
            <Text fw={700}>{currentTrack.item.name}</Text>
            <Text fw={500}>{currentTrack.item.album.name}</Text>
            <Text fw={300}>{currentTrack.item.artists[0].name}</Text>
            <Text fw={100}>{currentTrack.item.album.release_date}</Text>
          </div>
        </Card.Section>
        <footer>
          <Group className="PlayerControls" grow justify="center">
            <LikeButton trackId={currentTrack.item.id} />
            <Tooltip label="Play">
              <ActionIcon variant="light" aria-label="Play" onClick={() => dispatch(play())} disabled={isPlaying}>
                <IconPlayerPlay style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Pause">
              <ActionIcon variant="light" aria-label="Pause" onClick={() => dispatch(pause())} disabled={!isPlaying}>
                <IconPlayerPause style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Previous">
              <ActionIcon variant="light" aria-label="Previous Track" onClick={() => dispatch(previous())}>
                <IconPlayerTrackPrev style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Next">
              <ActionIcon variant="light" aria-label="Next Track" onClick={() => dispatch(next())}>
                <IconPlayerTrackNext style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </footer>
      </Card>
    </div>
  );
}
