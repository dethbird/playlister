import React from 'react';
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
        if (!spotifyUser.display_name) {
            return null;
        }
        return (
            <PaperStyled shadow="xs" p="xs" m="xs">
                <Stack
                    align="stretch"
                    justify="flex-start"
                    gap="xs">
                    <Box>
                        <Avatar src={spotifyUser.images[0].url} alt={spotifyUser.display_name} size={ {base: 6, sm: 14, md: 16} } className='Avatar' />
                        <Text fw={500} >{spotifyUser.display_name}</Text>
                        <Anchor href="/logout" title='Logout'>Logout <IconLogout style={iconStyle}/></Anchor>
                    </Box>
                    <Box>
                        <Anchor role='button' arial-label='SwitchTheme' onClick={() => { dispatch(toggleTheme()) }} title='Switch theme'>Switch theme <IconSwitchHorizontal style={iconStyle}/></Anchor><br />
                    </Box>
                </Stack>
            </PaperStyled>
        );
    };

    return (
        <Grid className='Nav'>
            <Grid.Col span={{ base: 3, xs: 2 }} >
                <Image src='/img/logo.001.png' />
            </Grid.Col>
            <Grid.Col offset={{ base: 3, xs: 6, sm: 7 }} span={{ base: 6, xs: 4, sm: 3 }}>
                {renderSpotifyUser()}
            </Grid.Col>

        </Grid>
    );
}

export default Nav;
