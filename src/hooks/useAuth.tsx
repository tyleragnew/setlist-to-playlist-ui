import { useEffect, useRef, useState } from 'react';

const clientId = 'd74b3ce0fbf342ecbfc8b32423800fa2';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const callbackURL = 'https://setlist-to-playlist-ui.vercel.app/callback';

type TokenResponse = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
};

export function useAuth() {
    const [token, setToken] = useState<string>(() => localStorage.getItem('access_token') ?? '');
    const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refresh_token'));
    const [expiry, setExpiry] = useState<number | null>(() => {
        const v = localStorage.getItem('access_token_expiry');
        return v ? Number(v) : null;
    });

    const refreshTimer = useRef<number | null>(null);

    useEffect(() => {
        if (token && expiry) {
            const now = Date.now();
            const msUntil = expiry - now - 60000; // refresh 60s before expiry
            if (msUntil > 0) {
                refreshTimer.current = window.setTimeout(() => void refreshAccessToken(), msUntil);
            } else {
                // expired or about to expire
                void refreshAccessToken();
            }
        }

        return () => {
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, expiry]);

    useEffect(() => {
        // If there's no token, but a code param exists, exchange it.
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code && !token) {
            void exchangeCodeForToken(code);
        }
        // else if no code and no token, PKCE flow will be started by app if needed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function exchangeCodeForToken(code: string) {
        const codeVerifier = localStorage.getItem('code_verifier') ?? '';
        const payload = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackURL,
            code_verifier: codeVerifier,
        });

        try {
            const res = await fetch(tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload });
            const json: TokenResponse = await res.json();
            if (json.access_token) {
                persistTokenResponse(json);
            } else {
                console.error('Token exchange failed', json);
            }
        } catch (err) {
            console.error('Error exchanging code', err);
        } finally {
            // remove code param so refreshes don't re-trigger exchange
            const params = new URLSearchParams(window.location.search);
            params.delete('code');
            const newSearch = params.toString();
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
            window.history.replaceState({}, '', newUrl);
        }
    }

    async function refreshAccessToken() {
        if (!refreshToken) return;
        const payload = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        });

        try {
            const res = await fetch(tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload });
            const json: TokenResponse = await res.json();
            if (json.access_token) {
                persistTokenResponse(json);
            } else {
                console.error('Refresh failed', json);
                // clear tokens to force re-auth
                clearAuth();
            }
        } catch (err) {
            console.error('Error refreshing token', err);
            clearAuth();
        }
    }

    function persistTokenResponse(json: TokenResponse) {
        if (json.access_token) {
            setToken(json.access_token);
            localStorage.setItem('access_token', json.access_token);
        }
        if (json.refresh_token) {
            setRefreshToken(json.refresh_token);
            localStorage.setItem('refresh_token', json.refresh_token);
        }
        if (json.expires_in) {
            const expiryTs = Date.now() + json.expires_in * 1000;
            setExpiry(expiryTs);
            localStorage.setItem('access_token_expiry', String(expiryTs));
        }
    }

    function clearAuth() {
        setToken('');
        setRefreshToken(null);
        setExpiry(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token_expiry');
        localStorage.removeItem('code_verifier');
    }

    return {
        token,
        refreshToken,
        expiry,
        isAuthenticated: Boolean(token),
        exchangeCodeForToken,
        refreshAccessToken,
        clearAuth,
    } as const;
}

export default useAuth;
