import React from 'react';
import { Avatar, Grid, Paper } from '@mantine/core';

function Nav({ spotifyUser }) {
    return (
        <Grid className='Nav'>
            <Grid.Col offset={{ base: 5, sm: 8 } } span={{ base: 7, sm: 4 } }>
                <Paper className="UserDetails" shadow="xs" p="xs" m="xs">
                    <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} className='Avatar'/>
                    {spotifyUser.display_name}
                    <br />
                    <a href="/logout">Logout</a>
                </Paper>

            </Grid.Col>

        </Grid>
    );
}

export default Nav;
