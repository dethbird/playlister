import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Container, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import {
  getManagedPlaylists,
  reorderPlaylists,
  selectPlaylists,
  selectStatus
} from './managedPlaylistsSlice';

import { ManagedPlaylistItem } from './ManagedPlaylistItem';


export function ManagedPlaylists() {

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getManagedPlaylists());
  }, [dispatch]);

  const playlists = useSelector(selectPlaylists);
  const status = useSelector(selectStatus);

  if (playlists.length < 1) {
    return (
      <Container m='xl'>
        <Alert variant="light" color="grape" title="No managed playlists" icon={<IconInfoCircle />}>
          Click the Spotify icon in the Playlists menu to start adding playlists you would like to manage.
        </Alert>
      </Container>
    )
  }

  const renderItems = () => {

    if (status === 'rejected') {
      return <div>Error...</div>;
    }

    if (['pending', 'idle'].includes(status) && !playlists) {
      return <div aria-busy="true"></div>;
    }

    return playlists.map(item => {
      return <ManagedPlaylistItem playlist={item} key={item.id} />;
    })
  }

  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const items = active.data.current.sortable.items;
      const sorted = arrayMove(
        items,
        items.indexOf(active.id),
        items.indexOf(over.id)
      );
      dispatch(reorderPlaylists(sorted));
    }
  }

  return (
    <div className='ManagedPlaylists'>
      <Text tt='uppercase' ta='left' >Managed playlists</Text>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={playlists}>
          {renderItems()}
        </SortableContext>
      </DndContext>
    </div>
  );
}
