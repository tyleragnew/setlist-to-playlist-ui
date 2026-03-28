import { useEffect } from 'react';
import { BinarySpinner } from '../components/BinarySpinner';

const clientId = 'd74b3ce0fbf342ecbfc8b32423800fa2';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const callbackURL = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;

export function Callback() {
    const code = new URLSearchParams(window.location.search).get('code');

    useEffect(() => {
        if (!code) return;

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
                const params = new URLSearchParams(window.location.search);
                params.delete('code');
                const newSearch = params.toString();
                const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
                window.history.replaceState({}, '', newUrl);

                // Wait for React to update state before redirecting
                setTimeout(() => {
                    window.location.replace('/');
                }, 50);
            } catch (err) {
                console.error('Error exchanging code in callback page', err);
                // Error is logged to console above
            }
        })();
    }, [code]);

    return <BinarySpinner size='md' fullScreen />;
}

export default Callback;
