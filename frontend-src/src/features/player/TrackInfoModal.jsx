import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Text, Stack, Group, Image, Anchor, Divider, Badge, Loader, Alert } from '@mantine/core';
import { IconDisc, IconAlertCircle } from '@tabler/icons-react';
import { theme } from '../../app/theme';
import { useMantineColorScheme } from '@mantine/core';
import dayjs from 'dayjs';
import {
  getArtistInfo,
  clearArtistInfo,
  selectArtistInfo,
  selectArtistInfoStatus,
  selectArtistInfoError
} from './playerSlice';

export function TrackInfoModal({ opened, onClose, track }) {
  const { colorScheme } = useMantineColorScheme();
  const dispatch = useDispatch();
  
  const artistInfo = useSelector(selectArtistInfo);
  const artistInfoStatus = useSelector(selectArtistInfoStatus);
  const artistInfoError = useSelector(selectArtistInfoError);
  
  // Track the artist ID we last fetched for
  const lastFetchedArtistIdRef = useRef(null);
  
  // Get the primary artist ID from the track
  const primaryArtistId = track?.artists?.[0]?.id;
  
  // Fetch artist info when modal opens or track changes
  useEffect(() => {
    if (opened && primaryArtistId && primaryArtistId !== lastFetchedArtistIdRef.current) {
      lastFetchedArtistIdRef.current = primaryArtistId;
      dispatch(getArtistInfo(primaryArtistId));
    }
  }, [opened, primaryArtistId, dispatch]);
  
  // Clear artist info when modal closes
  useEffect(() => {
    if (!opened) {
      lastFetchedArtistIdRef.current = null;
      dispatch(clearArtistInfo());
    }
  }, [opened, dispatch]);

  if (!track) {
    return null;
  }

  const albumImage = track.album?.images?.[0]?.url;
  const artists = track.artists || [];
  const album = track.album || {};

  // Format follower count with commas
  const formatFollowers = (count) => {
    if (!count) return null;
    return count.toLocaleString();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Track Info"
      padding="md"
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Album Art */}
        <Group justify="center">
          {albumImage ? (
            <Image
              radius="md"
              src={albumImage}
              w={200}
              h={200}
              fit="cover"
              alt={`${album.name} album art`}
            />
          ) : (
            <IconDisc
              size={200}
              stroke={1.5}
              color={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]}
            />
          )}
        </Group>

        {/* Track Name */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">Track</Text>
          <Anchor
            c={theme.colors['pale-purple'][colorScheme === 'light' ? 4 : 1]}
            td="none"
            fw={700}
            size="xl"
            href={track.uri}
            target="_blank"
            rel="noreferrer"
          >
            {track.name}
          </Anchor>
        </div>

        <Divider />

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

        {/* Album */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">Album</Text>
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
    </Modal>
  );
}
