import React from 'react';
import { Container, Image, Text, Title } from '@mantine/core';

function HowTo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title pb='md'>How To Guide</Title>
            <Text>There’s no trick to using Playlister. You choose which of your Spotify playlists you would like to manage, and then add or remove the currently playing track from them. This mode of operation can help with the following:</Text>
            <Title order={2} py='md'>1. Vetting</Title>
            <Text>As in: play one of your playlists and use the app to decide what does and doesn’t actually belong in it.</Text>
            <Title order={2} py='md'>2. Discovery</Title>
            <Text>Like when: playing your Discover Weekly or Release Radar playlist (for example), you can pluck just the songs you like and put them in your correct playlists.</Text>
            <Title order={2} py='md'>Getting Started:</Title>
            <Text pb='md'>On first login, the app will ask you to select some of your playlists from Spotify, using the Spotify button as seen here:</Text>
            <Image src='/img/playlister_first_time.jpg' w='100%' h='auto' />
            <Text py='md'>You also need to play a track on Spotify from any of your devices. Once you do that, the add and remove buttons will light up.</Text>
            <Image src='/img/playlister_working.jpg' w='100%' h='auto' />
            <Text py='md'>You can now add / remove the currently playing track from all active playlists (the purple switches) or individually at the playlist level.</Text>
            <Text py='md'>That's it! Your playlists will hopefully thank you.</Text>
            <Text py='md'>If you have any questions please contact us at <a href='mailto:rishi@playlister.love'>rishi@playlister.love</a>.</Text>
        </Container>
    );
}

export default HowTo;
