import React from 'react';
import { Container, Image, Text, Title } from '@mantine/core';

function About() {
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title pb='md'>Meet the Developers</Title>

            <Image src='/img/about.jpg' display='inline-block' style={{float: 'left'}} h={540} w='auto'pr='xl'/>

            <Text pb='sm' fw={300}>there’s just the one. the one with the glasses. well two i guess, Johnny was in the office.</Text>

            <Text>Meet Rishi Satsangi the developer of Playlister. He has a strong passion for hating his own crappy playlists. So he did something about it.</Text>

            <Text fw={800} py='md'>And you get to reap the benefits.</Text>

            <Text>Rishi is a former software engineer from Sony Music Entertainment, he just wants you to love your music. That’s all he wants, I mean … <Text fw={800}>C’MON.</Text></Text>
        </Container>
    );
}

export default About;
