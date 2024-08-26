import React from 'react';
import { Button, Container, Image, Text, Title } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { signTos } from '../features/user/userSlice';

function Tos({ signed }) {
    const dispatch = useDispatch();
    return (
        <Container p='xl' ta='left' fw={400} >
            <Title pb='md'>Terms of Service</Title>

            <Title order={2} py='md'>1. Introduction</Title>

            <Text>Welcome to Playlister! These Terms of Service ("Terms") govern your access to and use of our app ("Playlister," "we," "us," or "our"). By using Playlister, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our app.</Text>

            <Title order={2} py='md'>2. Use of the App</Title>

            <Title order={3} pb='md'>2.1 Eligibility</Title>

            <Text>You must be at least 13 years old to use Playlister. By using the app, you represent and warrant that you meet this age requirement.</Text>

            <Title order={3} pb='md'>2.2 License</Title>

            <Text>We grant you a limited, non-exclusive, non-transferable, and revocable license to use Playlister for personal, non-commercial purposes. You agree not to use the app for any illegal or unauthorized purposes.</Text>

            <Title order={3} pb='md'>2.3 Restrictions</Title>

            <Text>You agree not to:</Text>

            <ul>
                <li>Modify, adapt, translate, or reverse engineer any part of the app.</li>
                <li>Use the app to engage in any unlawful activity or infringe on the rights of others.</li>
                <li>Use any automated systems (e.g., bots) to access the app.</li>
            </ul>

            <Title order={2} py='md'>3. User Content</Title>

            <Title order={3} pb='md'>3.1 Your Content</Title>

            <Text>Playlister allows you to manage your Spotify playlists. You retain ownership of any content you manage through the app. However, by using Playlister, you grant us a worldwide, non-exclusive, royalty-free license to access and use your Spotify account data as necessary to provide the app's services.</Text>

            <Title order={3} pb='md'>3.2 Prohibited Content</Title>

            <Text>You agree not to use Playlister to distribute content that:</Text>

            <ul>
                <li>Is illegal, harmful, or violates the rights of others.</li>
                <li>Contains malware, viruses, or any other harmful code.</li>
            </ul>

            <Title order={2} py='md'>4. Privacy</Title>

            <Text>Your privacy is important to us. Please review our [Privacy Policy](https://www.notion.so/Terms-of-Service-fdbd66975c724e74bff2924bea7bf010?pvs=21) to understand how we collect, use, and protect your personal information.</Text>

            <Title order={2} py='md'>5. Third-Party Services</Title>

            <Text>Playlister integrates with Spotify to provide its services. By using Playlister, you agree to comply with Spotify’s terms and conditions, available at <a href='https://www.spotify.com/legal/end-user-agreement/' taget='_blank'>Spotify's Terms of Service</a>.</Text>

            <Title order={2} py='md'>6. Intellectual Property</Title>

            <Text>All intellectual property rights in the app, including but not limited to the software, design, and content, are owned by us or our licensors. You are granted no rights in or to the app other than the right to use it in accordance with these Terms.</Text>

            <Title order={2} py='md'>7. Termination</Title>

            <Text>We reserve the right to terminate or suspend your access to Playlister at our sole discretion, without notice or liability, for any reason, including but not limited to your breach of these Terms.</Text>

            <Title order={2} py='md'>8. Disclaimer of Warranties</Title>

            <Text>Playlister is provided "as is" and "as available" without warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the app will be error-free, secure, or available at all times.</Text>

            <Title order={2} py='md'>9. Limitation of Liability</Title>

            <Text>To the maximum extent permitted by law, Playlister shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</Text>

            <ul>
                <li>Your use of or inability to use the app.</li>
                <li>Any unauthorized access to or use of our servers or any personal information.</li>
                <li>Any bugs, viruses, or other harmful code transmitted to or through the app by any third party.</li>
            </ul>


            <Title order={2} py='md'>10. Indemnification</Title>

            <Text>You agree to indemnify and hold harmless Playlister, its affiliates, and its and their respective officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the app.</Text>

            <Title order={2} py='md'>11. Changes to the Terms</Title>

            <Text>We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by updating the date at the top of the Terms and, in some cases, by providing additional notice (such as adding a statement to our homepage or sending you a notification). Your continued use of Playlister after the revised Terms become effective means you agree to the revised Terms.</Text>

            <Title order={2} py='md'>12. Governing Law</Title>

            <Text>These Terms are governed by and construed in accordance with the laws of the State of Ohio, without regard to its conflict of law principles.</Text>

            <Title order={2} py='md'>13. Contact Us</Title>

            <Text>If you have any questions or concerns about these Terms, please contact us at <a href='mailto:rishi@playlister.love'>rishi@playlister.love</a>.</Text>

            { signed === 'N' ? <Container py='xl' ta='center'><Button
                className='LoginButton'
                color="green"
                size="xl"
                radius="xl"
                onClick={() => { dispatch(signTos()) }}
                role='button'
                name='Agree to TOS'
                title='Agree to TOS'
            >
                Agree <Image src='/img/spotify_logo.png' className='SpotifyLogo' />
            </Button></Container> : null }

        </Container>
    );
}

export default Tos;
