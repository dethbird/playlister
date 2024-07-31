import React from 'react';
import { Anchor, Avatar, Grid, Image, Paper, Text } from '@mantine/core';

function Nav({ spotifyUser }) {
    return (
        <Grid className='Nav'>
            <Grid.Col span={{ base: 4, xs: 4, sm: 4, m: 1 }}>
                <Paper shadow="xs" p="xs" m="xs">
                    <Image src='/img/logo.002.jpg' />
                </Paper>
            </Grid.Col>
            <Grid.Col offset={{ base: 1, xs: 2, sm: 3}} span={{ base: 7, xs: 6, sm: 5 }}>
                <Paper shadow="xs" p="xs" m="xs">
                    <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} className='Avatar' />
                    <Text fw={500}>{spotifyUser.display_name}</Text>
                    <Anchor href="/logout" title='Logout'>Logout</Anchor>
                </Paper>

            </Grid.Col>

        </Grid>
    );
}

export default Nav;
