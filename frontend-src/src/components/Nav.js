import React from 'react';
import { Avatar, Paper } from '@mantine/core';

function Nav({ spotifyUser }) {
    return (
        <div className="Nav row">
            <div className="col-xs-offset-9 col-xs-3">
                <Paper className="UserDetails" shadow="xs" p="xs" m="xs">
                    <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} className='Avatar'/>
                    {spotifyUser.display_name}
                    <br />
                    <a href="/logout">Logout</a>
                </Paper>

            </div>

        </div>
    );
}

export default Nav;
