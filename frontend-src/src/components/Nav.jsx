import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Anchor, Avatar, Box, Grid, Image, Stack, Text } from '@mantine/core';
import {
    IconLogout,
    IconSwitchHorizontal
} from '@tabler/icons-react';
import { gsap } from 'gsap';

import { PaperStyled } from './PaperStyled';
import { toggleTheme } from '../features/user/userSlice';

function Nav({ spotifyUser }) {

    const dispatch = useDispatch();
    const logoRef = useRef(null);

    const iconStyle = { width: '16px', height: '16px', verticalAlign: 'middle' };

    useLayoutEffect(() => {
        if (!logoRef.current) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(logoRef.current,
                { opacity: 0, y: -15, scale: 0.95, rotate: -8 },
                { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.9, ease: 'power3.out' }
            );
        }, logoRef);

        return () => ctx.revert();
    }, []);

    const renderSpotifyUser = () => {
        return (
            <PaperStyled shadow="xs" p="xs" my="xs">
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
                <Link to="/"><Image ref={logoRef} src='/img/logo.001.png' h='auto' w={{ base: 120 }} pt={2} /></Link>
            </Grid.Col>
            <Grid.Col offset={{ base: 2, xs: 5, sm: 7 }} span={{ base: 7, xs: 5, sm: 3 }}>
                {renderSpotifyUser()}
            </Grid.Col>

        </Grid>
    );
}

export default Nav;
