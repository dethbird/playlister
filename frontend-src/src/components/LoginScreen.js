import React from 'react';
import { Button, Container, Grid, Image, Overlay, Text } from '@mantine/core';
import classes from './LoginScreen.module.css';

function LoginScreen() {
    return (
        <Container className={classes.hero} style={{ borderRadius: '10px' }} p='xs' m='xs'>
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .55) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container shadow="xl" m="xs" p="xs" className={classes.container} size="lg">
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4}}>
                        <Image src='/img/logo.001.png' size='lg'/>
                    </Grid.Col>
                </Grid>

                <Text p="md" pb='xl' fw={700} size='xl'>Add or remove the currently playing track from multiple playlists at once.</Text>
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
                <Container p={{ base: 'sm', sm: 'xl' }} m='xl'>

                    <Image style={ {borderRadius: '50px'}} src='https://cdn.midjourney.com/fec2f169-47a5-49cf-a757-3d78d5cc49cf/0_0.png'  />
                    <Text mt='lg' fw={ 400 } size='lg' >Struggling with playlists that don't quite hit the mark? We've all been there—adding songs that seem right at the time, only to find yourself constantly hitting skip. Maybe that track would be perfect in a different playlist, but who has time to sift through the Spotify UI?</Text>
                    <Text mt='lg' fw={ 400 } size='lg'>Enter Playlister: the app that simplifies playlist management. With just a few clicks, you can effortlessly add or remove the currently playing track from multiple playlists at once. Get the right songs in the right places—no more skips, just smooth listening.</Text>
                </Container>
            </Container>
        </Container>
    );
}

export default LoginScreen;
