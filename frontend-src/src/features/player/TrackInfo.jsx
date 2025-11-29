import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Stack, Group, Image, Anchor, Divider, Badge, Loader, Alert, Box, Container } from '@mantine/core';
import { IconDisc, IconAlertCircle, IconPlayerPlay } from '@tabler/icons-react';
import { theme } from '../../app/theme';
import { useMantineColorScheme } from '@mantine/core';
import dayjs from 'dayjs';
import {
  getArtistInfo,
  getAlbumInfo,
  clearTrackInfoModal,
  selectArtistInfo,
  selectArtistInfoStatus,
  selectAlbumInfo,
  selectAlbumInfoStatus,
  selectCurrentTrack,
  selectStatus
} from './playerSlice';

export function TrackInfo() {
  const { colorScheme } = useMantineColorScheme();
  const dispatch = useDispatch();
  
  const currentTrack = useSelector(selectCurrentTrack);
  const playerStatus = useSelector(selectStatus);
  const artistInfo = useSelector(selectArtistInfo);
  const artistInfoStatus = useSelector(selectArtistInfoStatus);
  const albumInfo = useSelector(selectAlbumInfo);
  const albumInfoStatus = useSelector(selectAlbumInfoStatus);
  
  // Track the IDs we last fetched for
  const lastFetchedArtistIdRef = useRef(null);
  const lastFetchedAlbumIdRef = useRef(null);
  
  const track = currentTrack?.item;
  
  // Get the primary artist ID and album ID from the track
  const primaryArtistId = track?.artists?.[0]?.id;
  const albumId = track?.album?.id;
  
  // Fetch artist info when track changes
  useEffect(() => {
    if (primaryArtistId && primaryArtistId !== lastFetchedArtistIdRef.current) {
      lastFetchedArtistIdRef.current = primaryArtistId;
      dispatch(getArtistInfo(primaryArtistId));
    }
  }, [primaryArtistId, dispatch]);
  
  // Fetch album info when track changes
  useEffect(() => {
    if (albumId && albumId !== lastFetchedAlbumIdRef.current) {
      lastFetchedAlbumIdRef.current = albumId;
      dispatch(getAlbumInfo(albumId));
    }
  }, [albumId, dispatch]);
  
  // Clear info when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearTrackInfoModal());
    };
  }, [dispatch]);

  // Format follower count with commas
  const formatFollowers = (count) => {
    if (!count) return null;
    return count.toLocaleString();
  };

  // Show loading state
  if (['pending', 'idle'].includes(playerStatus) && !track) {
    return (
      <Box mt='xs'>
        <Container mt='xs'>
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading track info...</Text>
          </Group>
        </Container>
      </Box>
    );
  }

  // Show nothing playing state
  if (!track || Object.keys(currentTrack).length === 0) {
    return (
      <Box mt='xs'>
        <Container mt='xs' data-animate="fade-in">
          <Alert variant="light" color="grape" title="Nothing is playing" icon={<IconPlayerPlay />}>
            Play something on Spotify on any of your devices to see track info here.
          </Alert>
        </Container>
      </Box>
    );
  }

  const albumImage = track.album?.images?.[0]?.url;
  const artists = track.artists || [];
  const album = track.album || {};

  return (
    <Box mt='xs' data-animate="fade-in">
      <Stack gap="md">
        {/* Primary Artist Info (from API) */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">Primary Artist</Text>
          
          {artistInfoStatus === 'pending' && (
            <Group gap="xs" mt="xs">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">Loading artist info...</Text>
            </Group>
          )}
          
          {artistInfoStatus === 'rejected' && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" mt="xs">
              Failed to load artist info
            </Alert>
          )}
          
          {artistInfoStatus === 'fulfilled' && artistInfo && (
            <Stack gap="xs" mt="xs">
              <Group gap="md" align="flex-start">
                {/* Artist Image */}
                {artistInfo.images?.[0]?.url && (
                  <Image
                    radius="xl"
                    src={artistInfo.images[artistInfo.images.length > 1 ? 1 : 0].url}
                    w={80}
                    h={80}
                    fit="cover"
                    alt={`${artistInfo.name}`}
                  />
                )}
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Anchor
                    c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]}
                    td="none"
                    fw={600}
                    size="lg"
                    href={artistInfo.uri || artistInfo.external_urls?.spotify}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {artistInfo.name}
                  </Anchor>
                  
                  {artistInfo.followers?.total && (
                    <Text size="sm" c="dimmed">
                      {formatFollowers(artistInfo.followers.total)} followers
                    </Text>
                  )}
                  
                  {artistInfo.popularity !== undefined && (
                    <Text size="sm" c="dimmed">
                      Popularity: {artistInfo.popularity}/100
                    </Text>
                  )}
                </Stack>
              </Group>
              
              {/* Genres */}
              {artistInfo.genres && artistInfo.genres.length > 0 && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">Genres</Text>
                  <Group gap="xs">
                    {artistInfo.genres.slice(0, 6).map((genre) => (
                      <Badge
                        key={genre}
                        variant="light"
                        color="grape"
                        size="sm"
                        tt="capitalize"
                      >
                        {genre}
                      </Badge>
                    ))}
                    {artistInfo.genres.length > 6 && (
                      <Badge variant="light" color="gray" size="sm">
                        +{artistInfo.genres.length - 6} more
                      </Badge>
                    )}
                  </Group>
                </div>
              )}
            </Stack>
          )}
        </div>

        {/* Other Artists (if multiple) */}
        {artists.length > 1 && (
          <>
            <Divider />
            <div>
              <Text size="sm" c="dimmed" tt="uppercase">Other Artists</Text>
              <Stack gap="xs" mt="xs">
                {artists.slice(1).map((artist) => (
                  <Anchor
                    key={artist.id}
                    c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]}
                    td="none"
                    fw={500}
                    size="md"
                    href={artist.uri}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {artist.name}
                  </Anchor>
                ))}
              </Stack>
            </div>
          </>
        )}

        <Divider />

        {/* Album Info (from API) */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">Album</Text>
          
          {albumInfoStatus === 'pending' && (
            <Group gap="xs" mt="xs">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">Loading album info...</Text>
            </Group>
          )}
          
          {albumInfoStatus === 'rejected' && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" mt="xs">
              Failed to load album info
            </Alert>
          )}
          
          {albumInfoStatus === 'fulfilled' && albumInfo && (
            <Stack gap="xs" mt="xs">
              <Group gap="md" align="flex-start">
                {/* Album Image */}
                {albumInfo.images?.[0]?.url && (
                  <Image
                    radius="md"
                    src={albumInfo.images[albumInfo.images.length > 1 ? 1 : 0].url}
                    w={80}
                    h={80}
                    fit="cover"
                    alt={`${albumInfo.name} album art`}
                  />
                )}
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Anchor
                    c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 3]}
                    td="none"
                    fw={500}
                    size="md"
                    href={albumInfo.uri || albumInfo.external_urls?.spotify}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {albumInfo.name}
                  </Anchor>
                  
                  {albumInfo.release_date && (
                    <Text size="sm" c="dimmed">
                      Released: {dayjs(albumInfo.release_date).format('MMMM DD, YYYY')}
                    </Text>
                  )}
                  
                  {albumInfo.album_type && (
                    <Text size="sm" c="dimmed" tt="capitalize">
                      Type: {albumInfo.album_type}
                    </Text>
                  )}
                  
                  {albumInfo.total_tracks && (
                    <Text size="sm" c="dimmed">
                      Total Tracks: {albumInfo.total_tracks}
                    </Text>
                  )}
                  
                  {albumInfo.popularity !== undefined && (
                    <Text size="sm" c="dimmed">
                      Popularity: {albumInfo.popularity}/100
                    </Text>
                  )}
                </Stack>
              </Group>
              
              {/* Label */}
              {albumInfo.label && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">Label</Text>
                  <Badge variant="light" color="blue" size="md">
                    {albumInfo.label}
                  </Badge>
                </div>
              )}
              
              {/* Copyrights */}
              {albumInfo.copyrights && albumInfo.copyrights.length > 0 && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">Copyright</Text>
                  <Stack gap={2}>
                    {albumInfo.copyrights.map((copyright, idx) => (
                      <Text key={idx} size="xs" c="dimmed">
                        {copyright.text}
                      </Text>
                    ))}
                  </Stack>
                </div>
              )}
              
              {/* Genres (if available) */}
              {albumInfo.genres && albumInfo.genres.length > 0 && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">Genres</Text>
                  <Group gap="xs">
                    {albumInfo.genres.slice(0, 6).map((genre) => (
                      <Badge
                        key={genre}
                        variant="light"
                        color="grape"
                        size="sm"
                        tt="capitalize"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </Stack>
          )}
          
          {/* Fallback to basic album info if not loaded yet */}
          {albumInfoStatus === 'idle' && (
            <Stack gap="xs" mt="xs">
              <Anchor
                c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 3]}
                td="none"
                fw={400}
                size="md"
                href={album.uri}
                target="_blank"
                rel="noreferrer"
              >
                {album.name}
              </Anchor>
              {album.release_date && (
                <Text size="sm" c="dimmed">
                  Released: {dayjs(album.release_date).format('MMMM DD, YYYY')}
                </Text>
              )}
              {album.album_type && (
                <Text size="sm" c="dimmed" tt="capitalize">
                  Type: {album.album_type}
                </Text>
              )}
              {album.total_tracks && (
                <Text size="sm" c="dimmed">
                  Total Tracks: {album.total_tracks}
                </Text>
              )}
            </Stack>
          )}
        </div>

        <Divider />

        {/* Track Details */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">Track Details</Text>
          {track.track_number && (
            <Text size="sm">Track Number: {track.track_number}</Text>
          )}
          {track.disc_number && (
            <Text size="sm">Disc Number: {track.disc_number}</Text>
          )}
          {track.duration_ms && (
            <Text size="sm">
              Duration: {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
            </Text>
          )}
          {track.explicit !== undefined && (
            <Text size="sm">Explicit: {track.explicit ? 'Yes' : 'No'}</Text>
          )}
          {track.popularity !== undefined && (
            <Text size="sm">Popularity: {track.popularity}/100</Text>
          )}
        </div>
      </Stack>
    </Box>
  );
}
