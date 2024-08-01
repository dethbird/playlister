import React from 'react';
import { Button, Container, Grid, Image, Overlay, Text } from '@mantine/core';
import classes from './LoginScreen.module.css';

function LoginScreen() {
    return (
        <div className={classes.hero}>
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .55) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container shadow="xl" m="xs" p="md" className={classes.container} size="md">
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <Image src='/img/logo.001.png' className='AppLogo' />
                    </Grid.Col>
                </Grid>

                <Text p="md" fw={300}>Add / remove your currently playing track from multiple playlists at once.</Text>
                <Button color="green" m='xl' size="xl" radius="xl" href="/auth/spotify" onClick={() => { document.location = '/auth/spotify' }}>
                     Login with Spotify <Image src='/img/spotify_logo.png' className='SpotifyLogo' />
                </Button>
            </Container>
        </div>
    );
}

export default LoginScreen;
