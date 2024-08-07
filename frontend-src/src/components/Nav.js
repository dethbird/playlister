import React from 'react';
import { useDispatch } from 'react-redux';
import { Anchor, Avatar, Grid, Image, Text } from '@mantine/core';
import { PaperStyled } from './PaperStyled';
import { toggleTheme } from '../features/user/userSlice';

function Nav({ spotifyUser }) {
    const dispatch = useDispatch();

    const renderSpotifyUser = () => {
        if (!spotifyUser.display_name) {
            return null;
        }
        return (
            <PaperStyled shadow="xs" p="xs" m="xs">
                <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} className='Avatar' />
                <Text fw={500}>{spotifyUser.display_name}</Text>
                <Anchor onClick={() => { dispatch(toggleTheme())}} title='Switch theme'>Switch theme</Anchor><br />
                <Anchor href="/logout" title='Logout'>Logout</Anchor>
            </PaperStyled>
        );
    };

    return (
        <Grid className='Nav'>
            <Grid.Col span={{ base: 3, xs: 2 }}>
                <Image src='/img/logo.001.png' />
            </Grid.Col>
            <Grid.Col offset={{ base: 3, xs: 6, sm: 7 }} span={{ base: 6, xs: 4, sm: 3 }}>
                { renderSpotifyUser() }
            </Grid.Col>

        </Grid>
    );
}

export default Nav;
