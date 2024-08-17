import React from 'react';
import { Button, Container, Grid, Image, Overlay, Text } from '@mantine/core';
import classes from './LoginScreen.module.css';

function LoginScreen() {
    return (
        <Container className={classes.hero} style={{ borderRadius: '10px'}} >
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .55) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container shadow="xl" m="xs" p="md" className={classes.container} size="lg">
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                        <Image src='/img/logo.001.png' />
                    </Grid.Col>
                </Grid>

                <Text p="md" fw={400}>Add / remove your currently playing track from multiple playlists at once.</Text>
                <Button
                    color="green"
                    size="xl"
                    radius="xl"
                    href="/auth/spotify"
                    onClick={() => { window.location.assign('/auth/spotify') }}
                    role='button'
                    name='login with spotify'
                    title='Login with Spotify'
                >
                    <Image src='/img/spotify_logo.png' className='SpotifyLogo' /> Login with Spotify
                </Button>
            </Container>
        </Container>
    );
}

export default LoginScreen;
