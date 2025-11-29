import React, { useState } from 'react';
import { Box, Tabs } from '@mantine/core';
import { IconPlaylist, IconInfoCircle } from '@tabler/icons-react';
import { ManagedPlaylists } from '../managedPlaylists/ManagedPlaylists';
import { TrackInfo } from './TrackInfo';

export function PlaylistTrackTabs() {
  const [activeTab, setActiveTab] = useState('playlists');

  return (
    <Box mt='xs'>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="playlists" leftSection={<IconPlaylist size={16} />}>
            Managed Playlists
          </Tabs.Tab>
          <Tabs.Tab value="trackinfo" leftSection={<IconInfoCircle size={16} />}>
            Track Info
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="playlists">
          <ManagedPlaylists hideTitle />
        </Tabs.Panel>

        <Tabs.Panel value="trackinfo">
          <TrackInfo />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
