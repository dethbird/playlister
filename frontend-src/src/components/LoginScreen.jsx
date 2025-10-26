import React from 'react';
import { Box, Button, Container, Image, Overlay, Text } from '@mantine/core';
import classes from './LoginScreen.module.css';

function LoginScreen() {
    const bgUrl = '/img/login-bg.jpg';
    return (
        <Container className={classes.hero} p='lg' mt='sm' style={{ '--login-bg': `url(${bgUrl})` }}>
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .55) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container shadow="xl" m="xs" className={classes.container} size="lg">
                <Box ta='center'>
                <Image src='/img/logo.001.png' w={{ base: 225, xs: 350, sm: 400 }} height='auto' display='inline-block' className='AppLogo' my='xs' />        
                    <Text pt='lg' fw={700} size='xl'>Add  / remove the currently playing track from multiple playlists at once.</Text>
                    <Text pt='md' pb='md' fw={300} >A new way of interacting with Spotify.</Text>
                    <Button
                        className='LoginButton'
                        color="green"
                        size="xl"
                        radius="xl"
                        onClick={() => { window.location.assign('/auth/spotify') }}
                        role='button'
                        name='login with spotify'
                        title='Login with Spotify'
                    >
                        Login with Spotify <Image src='/img/spotify_logo.png' className='SpotifyLogo' />
                    </Button>
                </Box>
                <Container p={{ base: 'xs', sm: 'xl' }} >
                    <Text mt='lg' fw={400} size='lg' mx={{ base: 'sm', xs: 'md', sm: 'xl'}} >Struggling with playlists that don't quite hit the mark? We've all been there—adding songs that seem right at the time, only to find yourself constantly hitting skip. Maybe that track would be perfect in a different playlist, but who has time to sift through the Spotify UI?</Text>
                    <Box ta='center'>
                        <Image display='inline-block' my='xl' style={{ borderRadius: '50px' }} src='https://cdn.midjourney.com/f300ebbe-1024-4a7c-b9ca-4fb84a708df4/0_1.png' h={{ base: 160, xs: 240, sm: 320 }} w='auto' />
                    </Box>
                    <Text mt='lg' fw={400} size='lg' mx={{ base: 'sm', xs: 'md', sm: 'xl'}}>Enter Playlister: the app that simplifies playlist management. With just a few clicks, you can effortlessly add or remove the currently playing track from multiple playlists at once. Get the right songs in the right places—no more skips, just smooth listening.</Text>
                    <Box ta='center'>
                        <Image display='inline-block' my='xl'  style={{ borderRadius: '50px' }} src='https://cdn.midjourney.com/fec2f169-47a5-49cf-a757-3d78d5cc49cf/0_0.png'  h={{ base: 160, xs: 240, sm: 320 }} w='auto' />
                    </Box>
                </Container>
            </Container>
        </Container>
    );
}

export default LoginScreen;
