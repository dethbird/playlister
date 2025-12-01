import React from 'react';
import { Grid, Table, Text, Loader, Alert, Badge, Progress, Stack, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function PlaylistMetrics({ metrics, status }) {
    if (status === 'pending') {
        return (
            <Group gap="xs" justify="center" py="md">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Loading playlist analytics...</Text>
            </Group>
        );
    }
    
    if (status === 'rejected') {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                Failed to load playlist analytics
            </Alert>
        );
    }
    
    if (!metrics) {
        return null;
    }
    
    const topArtists = (metrics.top_artists || []).slice(0, 25);
    const topGenres = (metrics.top_genres || []).slice(0, 25);
    
    return (
        <Stack gap="md" py="xs">
            {/* Summary badges */}
            <Group gap="xs">
                <Badge variant="light" color="grape" size="sm">
                    {metrics.total_tracks} tracks
                </Badge>
                <Badge variant="light" color="blue" size="sm">
                    {metrics.unique_artists} artists
                </Badge>
                <Badge variant="light" color="teal" size="sm">
                    {metrics.unique_albums} albums
                </Badge>
            </Group>
            
            <Grid gutter="md">
                {/* Top Artists */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={600} mb="xs" tt="uppercase" c="dimmed">
                        Top Artists
                    </Text>
                    {topArtists.length > 0 ? (
                        <Table striped highlightOnHover withTableBorder size="xs">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Artist</Table.Th>
                                    <Table.Th style={{ width: 80, textAlign: 'right' }}>%</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {topArtists.map((artist, index) => (
                                    <Table.Tr key={artist.id || index}>
                                        <Table.Td>
                                            <Group gap="xs" wrap="nowrap">
                                                <Text size="xs" c="dimmed" w={16}>{index + 1}.</Text>
                                                <Text size="sm" lineClamp={1}>{artist.name}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap="xs" justify="flex-end" wrap="nowrap">
                                                <Progress 
                                                    value={artist.percent} 
                                                    size="xs" 
                                                    color="grape" 
                                                    style={{ width: 40 }}
                                                />
                                                <Text size="xs" c="dimmed" w={36}>
                                                    {artist.percent}%
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Text size="sm" c="dimmed">No artist data available</Text>
                    )}
                </Grid.Col>
                
                {/* Top Genres */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={600} mb="xs" tt="uppercase" c="dimmed">
                        Top Genres
                    </Text>
                    {topGenres.length > 0 ? (
                        <Table striped highlightOnHover withTableBorder size="xs">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Genre</Table.Th>
                                    <Table.Th style={{ width: 80, textAlign: 'right' }}>%</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {topGenres.map((genre, index) => (
                                    <Table.Tr key={genre.name || index}>
                                        <Table.Td>
                                            <Group gap="xs" wrap="nowrap">
                                                <Text size="xs" c="dimmed" w={16}>{index + 1}.</Text>
                                                <Text size="sm" lineClamp={1} tt="capitalize">{genre.name}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap="xs" justify="flex-end" wrap="nowrap">
                                                <Progress 
                                                    value={genre.percent} 
                                                    size="xs" 
                                                    color="blue" 
                                                    style={{ width: 40 }}
                                                />
                                                <Text size="xs" c="dimmed" w={36}>
                                                    {genre.percent}%
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Text size="sm" c="dimmed">No genre data available</Text>
                    )}
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
