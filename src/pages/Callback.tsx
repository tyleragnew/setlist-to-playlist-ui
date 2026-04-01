import { useEffect, useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BinarySpinner } from '../components/BinarySpinner';

const clientId = 'd74b3ce0fbf342ecbfc8b32423800fa2';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const callbackURL = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;

function getInitialError(): string | null {
    const error = new URLSearchParams(window.location.search).get('error');
    if (!error) return null;
    return error === 'access_denied'
        ? 'Your Spotify account isn\'t on the allowlist for this app yet. You can still use S2P as a guest — no login needed!'
        : `Spotify returned an error: ${error}`;
}

export function Callback() {
    const code = new URLSearchParams(window.location.search).get('code');
    const navigate = useNavigate();
    const [authError, setAuthError] = useState<string | null>(getInitialError);

    useEffect(() => {
        if (authError || !code) return;

        (async () => {
            try {
                const codeVerifier = localStorage.getItem('code_verifier') ?? '';
                const payload = new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: callbackURL,
                    code_verifier: codeVerifier,
                });

                const res = await fetch(tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload });
                const json = await res.json();

                if (json.error) {
                    setAuthError('Login failed. You can still use S2P as a guest — no login needed!');
                    return;
                }

                if (json.access_token) {
                    localStorage.setItem('access_token', json.access_token);
                }
                if (json.refresh_token) {
                    localStorage.setItem('refresh_token', json.refresh_token);
                }
                if (json.expires_in) {
                    const expiryTs = Date.now() + Number(json.expires_in) * 1000;
                    localStorage.setItem('access_token_expiry', String(expiryTs));
                }

                // remove code param and navigate home so the main app can pick up stored tokens
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete('code');
                const newSearch = searchParams.toString();
                const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
                window.history.replaceState({}, '', newUrl);

                setTimeout(() => {
                    window.location.replace('/');
                }, 50);
            } catch (err) {
                console.error('Error exchanging code in callback page', err);
                setAuthError('Something went wrong during login. You can still use S2P as a guest!');
            }
        })();
    }, [code, authError]);

    if (authError) {
        return (
            <Box mx='auto' pt={16} pb={4} w='100%' maxW='480px' display='flex' flexDirection='column' alignItems='center'>
                <VStack spacing={5} textAlign='center'>
                    <Text fontSize='xl' fontWeight='bold' color='text.primary'>
                        Login Unavailable
                    </Text>
                    <Text fontSize='sm' color='text.muted' lineHeight='tall'>
                        {authError}
                    </Text>
                    <Button
                        onClick={() => navigate('/')}
                        colorScheme='spotify'
                        borderRadius='full'
                        size='lg'
                        px={8}
                    >
                        Continue as Guest
                    </Button>
                </VStack>
            </Box>
        );
    }

    return <BinarySpinner size='md' fullScreen />;
}

export default Callback;
