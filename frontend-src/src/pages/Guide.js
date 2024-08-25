import React from 'react';
import { Container, Text, Title } from '@mantine/core';

function Pp() {
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title>Guide</Title>
            <Text>If you have any questions please contact us at <a href='mailto:rishi@playlister.love'>rishi@playlister.love</a>.</Text>
        </Container>
    );
}

export default Pp;
