import React from 'react';
import { Button, Container, Paper } from '@mantine/core';
import classes from './LoginScreen.module.css';

function LoginScreen() {
    return (
        <Container>
            <Paper shadow="xl"  m="xs">
                <Button variant="gradient" m='xl' size="xl" radius="xl" href="/auth/spotify" onClick={()=>{ document.location = '/auth/spotify'}}>
                    Login with Spotify
                </Button>
            </Paper>
        </Container>
    );
}

export default LoginScreen;
