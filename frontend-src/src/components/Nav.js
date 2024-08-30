import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Anchor, Avatar, Box, Grid, Image, Stack, Text } from '@mantine/core';
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
            <PaperStyled shadow="xs" p="xs" my="xs">
                <Stack
                    align="stretch"
                    justify="flex-start"
                    gap="xs">
                    <Box>
                        <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} size={{ base: 6, sm: 14, md: 16 }} className='Avatar' display='inline-block' />
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
                <Link to="/"><Image src='/img/logo.001.png' h={{base: 105}} w='auto'/></Link>
            </Grid.Col>
            <Grid.Col offset={{ base: 2, xs: 5, sm: 7 }} span={{ base: 7, xs: 5, sm: 3 }}>
                {renderSpotifyUser()}
            </Grid.Col>

        </Grid>
    );
}

export default Nav;
