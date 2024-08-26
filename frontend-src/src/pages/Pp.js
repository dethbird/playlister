import React from 'react';
import { Button, Container, Image, Text, Title } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { signPP } from '../features/user/userSlice';

function Pp({ signed }) {
    const dispatch = useDispatch();
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title>Privacy Policy</Title>
            <Title order={2} py='md'>1. Introduction</Title>

            Welcome to Playlister! Your privacy is important to us. This Privacy Policy outlines how we handle information when you use our app ("Playlister," "we," "us," or "our"). By using Playlister, you agree to the practices described in this policy.

            <Title order={2} pb='md'>2. Information We Collect</Title>

            <Title order={3} pb='md'>2.1 Non-Personal Information</Title>

            <Text>When you use Playlister, we may collect non-personal information about your interactions with the app. This may include technical information such as your device type, operating system, app version, and usage data (e.g., features used, time spent in the app).</Text>

            <Title order={3} pb='md'>2.2 Spotify Integration</Title>

            Playlister integrates with Spotify to provide its services. While we access your Spotify account data to manage your playlists (e.g., adding or removing tracks), **we do not store any personally identifiable information (PII)**. All data accessed from Spotify is used solely during your session and is not retained by Playlister after your session ends.

            <Title order={2} pb='md'>3. How We Use the Information</Title>

            <Text>We use the non-personal information we collect to:</Text>

            <ul>
                <li>Improve the functionality and user experience of Playlister.</li>
                <li>Analyze usage trends and performance to enhance our app.</li>
            </ul>

            <Title order={2} pb='md'>4. Data Security</Title>

            <Text>We take reasonable measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of electronic storage or transmission is 100% secure.</Text>

            <Title order={2} pb='md'>5. Third-Party Services</Title>

            <Text>Playlister uses Spotify’s API to provide its services. Please note that your interactions with Spotify are governed by their privacy policy, which can be found at <a href='https://www.spotify.com/legal/end-user-agreement/' taget='_blank'>Spotify's Terms of Service</a>.</Text>

            <Title order={2} pb='md'>6. Children's Privacy</Title>

            <Text>Playlister is not intended for use by individuals under the age of 13. We do not knowingly collect any personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it as soon as possible.</Text>

            <Title order={2} pb='md'>7. Changes to This Privacy Policy</Title>

            <Text>We may update this Privacy Policy from time to time. If we make changes, we will notify you by updating the date at the top of this policy and, in some cases, providing additional notice (such as adding a statement to our homepage or sending you a notification). Your continued use of Playlister after any changes to this policy means you accept the revised policy.</Text>

            <Title order={2} pb='md'>8. Contact Us</Title>

            <Text>If you have any questions or concerns about this Privacy Policy, please contact us at <a href='mailto:rishi@playlister.love'>rishi@playlister.love</a>.</Text>

            { signed === 'N' ? <Container py='xl' ta='center'><Button
                className='LoginButton'
                color="green"
                size="xl"
                radius="xl"
                onClick={() => { dispatch(signPP()) }}
                role='button'
                name='Agree to PP'
                title='Agree to PP'
            >
                Got it <Image src='/img/spotify_logo.png' className='SpotifyLogo' />
            </Button></Container> : null }
        </Container>
    );
}

export default Pp;
