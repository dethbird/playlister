import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon, Alert, Box, Card, Container, Group, Image, Text, Title, Tooltip } from '@mantine/core';
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
import classes from './Player.module.css';

const dayjs = require('dayjs');


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
    return <div role='alert' aria-busy="true"></div>;
  }

  const sectionTitle = <Text tt='uppercase' ta='left' visibleFrom="xs">Currently Playing</Text>;

  if (Object.keys(currentTrack).length === 0) {
    return (
      <Box className={classes.Player} mt='xs'>
        {sectionTitle}
        <Container mt='xs'>
          <Alert variant="light" color="grape" title="Nothing is playing" icon={<IconPlayerPlay />}>
            Play something on Spotify on any of your devices then check back here.
          </Alert>
        </Container>
      </Box>
    )
  }

  // only set new timer in fulfilled state.
  if (isPlaying && currentTrack && !refreshTimer) {
    const refreshIn = currentTrack.item.duration_ms - currentTrack.progress_ms + 100;
    refreshTimer = setTimeout(() => { dispatch(getCurrentTrack()) }, refreshIn);
  }

  return (
    <Box className={classes.Player} mt='xs'>
      {sectionTitle}
      <Card
        className='CurrentlyPlaying'
        mt='xs'
        shadow="sm"
        withBorder
      >
        <Card.Section>
          <Image
            radius="md"
            src={currentTrack.item.album.images[1].url}
            className={classes.AlbumArt}
            w={150}
            h="auto"
            fit="cover"
          />
          <div className={classes.AlbumInfo}>
            <Title order={4}>{currentTrack.item.name}</Title>
            <Text fw={800}>{currentTrack.item.artists[0].name}</Text>
            <Text fw={500}>{currentTrack.item.album.name}</Text>
            <Text fw={300}>{dayjs(currentTrack.item.album.release_date).format('YYYY, MMMM DD')}</Text>
          </div>
        </Card.Section>
        <footer>
          <Group className={classes.PlayerControls} grow justify="center" pt='xs'  >
            <LikeButton trackId={currentTrack.item.id} />
            <Tooltip label="Play">
              <ActionIcon variant="light" role='button' name="Play" aria-label="Play" onClick={() => dispatch(play())} disabled={isPlaying}>
                <IconPlayerPlay />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Pause">
              <ActionIcon variant="light" role='button' name="Pause" aria-label="Pause" onClick={() => dispatch(pause())} disabled={!isPlaying}>
                <IconPlayerPause />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Previous">
              <ActionIcon variant="light" role='button' name="Previous Track" aria-label="Previous Track" onClick={() => dispatch(previous())}>
                <IconPlayerTrackPrev />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Next">
              <ActionIcon variant="light" role='button' name="Next Track" aria-label="Next Track" onClick={() => dispatch(next())}>
                <IconPlayerTrackNext />
              </ActionIcon>
            </Tooltip>
          </Group>
        </footer>
      </Card>
    </Box>
  );
}
