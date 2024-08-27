import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container } from '@mantine/core';

function Footer() {
    return (
        <Container p='xl' ta='center' fw={400}>
            <footer >
                <Box>
                <Link to="/">Dash</Link> | <Link to="/howto">How To</Link> | <Link to="/about">About</Link> | <Link to="/tos">Terms of Service</Link> | <Link to="/pp">Privacy Policy</Link>
                </Box>
                <Box>&copy; {new Date().getFullYear()} Playlister.</Box>
            </footer>
        </Container>
    );
}

export default Footer;
