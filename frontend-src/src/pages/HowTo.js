import { Container, Text, Title } from '@mantine/core';

function HowTo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title pb='md'>How To Guide</Title>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/I6v7AxxfHuk?si=9iO5jPpr-xVLbhPu" title="Playlister for Spotify" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <Text>There’s no trick to using Playlister. You choose which of your Spotify playlists you would like to manage, and then add or remove the currently playing track from them. This mode of operation can help with the following:</Text>
            <Title order={2} py='md'>1. Vetting</Title>
            <Text>As in: play one of your playlists and use the app to decide what does and doesn’t actually belong in it.</Text>
            <Title order={2} py='md'>2. Discovery</Title>
            <Text>Like when: playing your Discover Weekly or Release Radar playlist (for example), you can pluck just the songs you like and put them in your correct playlists.</Text>
            <Text py='md'>If you have any questions please contact us at <a href='mailto:rishi@playlister.love'>rishi@playlister.love</a>.</Text>
        </Container>
    );
}

export default HowTo;
