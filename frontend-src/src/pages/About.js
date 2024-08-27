import React from 'react';
import { Blockquote, Container, Image, Text, Title } from '@mantine/core';
import {
    IconQuote
} from '@tabler/icons-react';

function About() {

  const icon = <IconQuote />;
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title pb='md'>Meet the Developers</Title>

            <Image src='/img/about.jpg' display='inline-block' style={{ float: 'left', borderRadius: '10px' }} h={540} w='auto' pr='xl' />

            <Text pb='sm' fw={300}>there’s just the one. the one with the glasses. well two i guess, Johnny was in the office.</Text>

            <Text>Meet Rishi Satsangi the developer of Playlister. He has a strong passion for hating his own crappy playlists. So he did something about it.</Text>

            <Text fw={800} py='md'>And you get to reap the benefits.</Text>

            <Text>Rishi is a former software engineer from Sony Music Entertainment, he just wants you to love your music. That’s all he wants, I mean … <Text fw={800}>C’MON.</Text></Text>

            <Title order={3} py='xl'>From the Developer:</Title>

            <Blockquote cite="– Rishi Satsangi" icon={ icon } mx='xl' p='lg' display='inline-block' w={ 450 }>
                <Text pb='sm'>I love Spotify, I use it all the time and hence my library is very large and varied and there are vibe issues if I just play my entire library on shuffle. I got annoyed whenever a track from an old Adam Sandler CD came up during a serious jam session, so I made Playlister </Text>
                <Text pb='sm'>Now my playlists have much better vibes. For example I have separate driving, home, and headphones music. There's stuff in headphones that I don't really want playing in my car or at home.</Text>
                <Text pb='sm'>Anyway, I hope it also makes YOUR playlists better!</Text>
            </Blockquote>

        </Container>
    );
}

export default About;
