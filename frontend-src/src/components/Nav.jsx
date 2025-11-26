import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Anchor, Avatar, Box, Grid, Stack, Text } from '@mantine/core';
import {
    IconLogout,
    IconSwitchHorizontal
} from '@tabler/icons-react';

import { PaperStyled } from './PaperStyled';
import { toggleTheme } from '../features/user/userSlice';

function Nav({ spotifyUser }) {

    const dispatch = useDispatch();

    const iconStyle = { width: '16px', height: '16px', verticalAlign: 'middle' };

    const renderSpotifyUser = () => {
        return (
            <PaperStyled shadow="xs" p="xs" my="xs" data-animate="fade-in">
                <Stack
                    align="stretch"
                    justify="flex-start"
                    gap="xs">
                    <Box>
                        <Avatar src={spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null} alt={spotifyUser.display_name} h={{ base: 32 }} w='auto' className='Avatar' display='inline-block' />
                        <Text fw={500} >{spotifyUser.display_name}</Text>
                        <Anchor role='button' arial-label='SwitchTheme' onClick={() => { dispatch(toggleTheme()) }} title='Switch theme'>Switch theme <IconSwitchHorizontal style={iconStyle} /></Anchor><br />
                        <Anchor href="/logout" title='Logout'>Logout <IconLogout style={iconStyle} /></Anchor>
                    </Box>
                </Stack>
            </PaperStyled>
        );
    };

    if (!spotifyUser.display_name) {
        return null;
    }

    return (
        <Grid className='Nav'>
            <Grid.Col span={{ base: 3, xs: 2 }} >
                <Link to="/">
                    <picture data-animate="fade-in">
                        <source media="(min-width: 640px)" srcSet="/img/logo.rectangle.png" />
                        <img src="/img/logo.001.png" alt="Playlister logo" style={{ maxHeight: 100, width: 'auto', paddingTop: 8 }} />
                    </picture>
                </Link>
            </Grid.Col>
            <Grid.Col offset={{ base: 2, xs: 5, sm: 7 }} span={{ base: 7, xs: 5, sm: 3 }}>
                {renderSpotifyUser()}
            </Grid.Col>

        </Grid>
    );
}

export default Nav;
