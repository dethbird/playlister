import React from 'react';
import { Anchor, Avatar, Grid, Image, Paper, Text } from '@mantine/core';

function Nav({ spotifyUser }) {
    return (
        <Grid className='Nav'>
            <Grid.Col span={{ base: 3, xs: 2}}>
                <Image src='/img/logo.001.png' />
            </Grid.Col>
            <Grid.Col offset={{ base: 3, xs: 6, sm: 7}} span={{ base: 6, xs: 4, sm: 3}}>
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
