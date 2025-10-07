import { useEffect, useState } from 'react';

const clientId = 'd74b3ce0fbf342ecbfc8b32423800fa2';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

export function Callback() {
    const [message, setMessage] = useState('Completing sign-in...');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
            setMessage('No code provided');
            return;
        }

        void (async () => {
            try {
                const codeVerifier = localStorage.getItem('code_verifier') ?? '';
                const payload = new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: window.location.origin + '/callback',
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
                urlParams.delete('code');
                const newSearch = urlParams.toString();
                const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
                window.history.replaceState({}, '', newUrl);

                window.location.replace('/');
            } catch (err) {
                console.error('Error exchanging code in callback page', err);
                setMessage('Sign-in failed. Check console for details.');
            }
        })();
    }, []);

    return <div>{message}</div>;
}

export default Callback;
