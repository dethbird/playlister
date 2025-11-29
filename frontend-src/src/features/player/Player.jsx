import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon, Alert, Anchor, Box, Card, Container, Group, Image, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconPlayerPause,
  IconPlayerPlay,
  IconDisc
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
import { theme } from '../../app/theme';
import dayjs from 'dayjs';
import { gsap } from 'gsap';
import { buttonAnimation } from '../../constants';

const formatTrackTime = (ms = 0) => {
  if (!Number.isFinite(ms) || ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function Player() {

  const currentTrack = useSelector(selectCurrentTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch();

  const { colorScheme } = useMantineColorScheme();
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

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

  if (status === 'rejected') {
    return null;
  }

  if (['pending', 'idle'].includes(status) && !currentTrack) {
    return <div role='alert' aria-busy="true"></div>;
  }

  const sectionTitle = <Text tt='uppercase' ta='left' visibleFrom="xs">Currently Playing</Text>;
  const trackDuration = currentTrack?.item?.duration_ms || 0;
  const trackProgress = currentTrack?.progress_ms || 0;

  useEffect(() => {
    setDisplayProgress(trackProgress);
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (!trackDuration || trackProgress >= trackDuration || !isPlaying) {
      return;
    }

    progressTimerRef.current = setInterval(() => {
      setDisplayProgress((prev) => {
        const nextValue = Math.min(trackDuration, prev + 1000);
        if (nextValue >= trackDuration && progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
        return nextValue;
      });
    }, 1000);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [trackDuration, trackProgress, currentTrack?.item?.id, isPlaying]);

  const progressPercent = trackDuration > 0 ? Math.min(100, Math.max(0, (displayProgress / trackDuration) * 100)) : 0;

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!isPlaying || !currentTrack?.item) {
      return undefined;
    }

    const remainingMs = Math.max(500, currentTrack.item.duration_ms - currentTrack.progress_ms);
    refreshTimerRef.current = setTimeout(() => {
      dispatch(getCurrentTrack());
    }, remainingMs + 200);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [dispatch, currentTrack?.item?.id, currentTrack?.progress_ms, isPlaying]);

  if (Object.keys(currentTrack).length === 0) {
    return (
      <Box className={classes.Player} mt='xs'>
        {sectionTitle}
        <Container mt='xs' data-animate="fade-in">
          <Alert variant="light" color="grape" title="Nothing is playing" icon={<IconPlayerPlay />}>
            Play something on Spotify on any of your devices then check back here.
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box className={classes.Player} mt='xs'>
      {sectionTitle}
      <Card
        className='CurrentlyPlaying'
        mt='xs'
        shadow="sm"
        withBorder
        data-animate="fade-in"
      >
        <Card.Section>
          {currentTrack.item.album.images && currentTrack.item.album.images.length > 0 ? (
            <Image
              radius="md"
              src={currentTrack.item.album.images[1] ? currentTrack.item.album.images[1].url : currentTrack.item.album.images[0].url}
              className={classes.AlbumArt}
              w={150}
              h="auto"
              fit="cover"
            />
          ) : (
            <IconDisc
              size={150}
              stroke={1.5}
              color={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]}
              className={classes.AlbumArt}
            />
          )}
          <div className={classes.AlbumInfo}>
            <Anchor c={theme.colors['pale-purple'][colorScheme === 'light' ? 4 : 1]} td='none' fw={700} size="xl" href={currentTrack.item.uri} target="_blank" rel="noreferrer">{currentTrack.item.name}</Anchor>
            <br />
            <Anchor c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]} td='none' fw={500} size="lg" href={currentTrack.item.artists[0].uri} target="_blank" rel="noreferrer">{currentTrack.item.artists[0].name}</Anchor>
            <br />
            <Anchor c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 3]} td='none' fw={400} size="md" href={currentTrack.item.album.uri} target="_blank" rel="noreferrer">{currentTrack.item.album.name}</Anchor>
            <Text size='sm' pt='xs' fw={300}>{dayjs(currentTrack.item.album.release_date).format('YYYY, MMMM DD')}</Text>
          </div>
        </Card.Section>
        <footer>
          <Group className={classes.PlayerControls} grow justify="center" pt='xs'  >
            <LikeButton trackId={currentTrack.item.id} />
            <Tooltip label={isPlaying ? "Pause" : "Play"}>
              <ActionIcon
                variant="light"
                role="button"
                name={isPlaying ? "Pause" : "Play"}
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={async (e) => {
                  const node = e.currentTarget || e.target;
                  gsap.fromTo(node, { boxShadow: '0 0 0 rgba(203,188,224,0.0)' }, { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' });
                  try {
                    if (isPlaying) {
                      await dispatch(pause()).unwrap();
                    } else {
                      await dispatch(play()).unwrap();
                    }
                  } catch (err) {
                    console.error('Unable to toggle playback', err);
                  } finally {
                    dispatch(getCurrentTrack());
                  }
                }}
              >
                {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Previous">
              <ActionIcon
                variant="light"
                role='button'
                name="Previous Track"
                aria-label="Previous Track"
                onClick={(e) => {
                  const node = e.currentTarget || e.target;
                  gsap.fromTo(node, { boxShadow: '0 0 0 rgba(203,188,224,0.0)' }, { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' });
                  dispatch(previous());
                }}
              >
                <IconPlayerTrackPrev />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Next">
              <ActionIcon
                variant="light"
                role='button'
                name="Next Track"
                aria-label="Next Track"
                onClick={(e) => {
                  const node = e.currentTarget || e.target;
                  gsap.fromTo(node, { boxShadow: '0 0 0 rgba(203,188,224,0.0)' }, { boxShadow: '0 0 20px rgba(203,188,224,0.55)', duration: buttonAnimation.bloomDuration, yoyo: true, repeat: 1, ease: 'power2.out' });
                  dispatch(next());
                }}
              >
                <IconPlayerTrackNext />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div
            className={classes.ProgressBar}
            role="progressbar"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={trackDuration}
            aria-valuenow={displayProgress}
          >
            <div className={classes.ProgressTrack}>
              <div
                className={classes.ProgressValue}
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: theme.colors.red[colorScheme === 'light' ? 4 : 5]
                }}
              />
            </div>
          </div>
          <Text size="xs" c="dimmed" className={classes.ProgressTime}>
            {formatTrackTime(displayProgress)} / {formatTrackTime(trackDuration)}
          </Text>
        </footer>
      </Card>
    </Box>
  );
}
