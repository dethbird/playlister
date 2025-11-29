import React from 'react';
import { Modal, Text, Stack, Group, Image, Anchor, Divider } from '@mantine/core';
import { IconDisc } from '@tabler/icons-react';
import { theme } from '../../app/theme';
import { useMantineColorScheme } from '@mantine/core';
import dayjs from 'dayjs';

export function TrackInfoModal({ opened, onClose, track }) {
  const { colorScheme } = useMantineColorScheme();

  if (!track) {
    return null;
  }

  const albumImage = track.album?.images?.[0]?.url;
  const artists = track.artists || [];
  const album = track.album || {};

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

        {/* Artists */}
        <div>
          <Text size="sm" c="dimmed" tt="uppercase">
            {artists.length > 1 ? 'Artists' : 'Artist'}
          </Text>
          <Stack gap="xs">
            {artists.map((artist) => (
              <Anchor
                key={artist.id}
                c={theme.colors['pale-purple'][colorScheme === 'light' ? 3 : 2]}
                td="none"
                fw={500}
                size="lg"
                href={artist.uri}
                target="_blank"
                rel="noreferrer"
              >
                {artist.name}
              </Anchor>
            ))}
          </Stack>
        </div>

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

        {/* Placeholder for future graph data */}
        <Divider />
        <Text size="xs" c="dimmed" ta="center">
          More artist and label information coming soon...
        </Text>
      </Stack>
    </Modal>
  );
}
