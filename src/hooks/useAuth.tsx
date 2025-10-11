import { useEffect, useRef, useState } from 'react';

const clientId = 'd74b3ce0fbf342ecbfc8b32423800fa2';
const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
// Resolve redirect URI from env (Vite) or fallback to current origin + /callback
const defaultRedirect = typeof window !== 'undefined' ? `${window.location.origin}/callback` : 'https://setlist-to-playlist-ui.vercel.app/callback';
const callbackURL = (import.meta as any).env?.VITE_SPOTIFY_REDIRECT_URI ?? defaultRedirect;

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

    // Spotify profile state
    const [profile, setProfile] = useState<{ displayName: string; image: string | null } | null>(null);

    const refreshTimer = useRef<number | null>(null);

    const isVitest = typeof import.meta !== 'undefined' && (import.meta as any).vitest;

    // Fetch Spotify profile when token is available
    useEffect(() => {
        if (!token) {
            setProfile(null);
            return;
        }
        (async () => {
            try {
                const res = await fetch('https://api.spotify.com/v1/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch Spotify profile');
                const json = await res.json();
                setProfile({
                    displayName: json.display_name ?? json.id ?? 'Spotify User',
                    image: Array.isArray(json.images) && json.images.length > 0 ? json.images[0].url : null,
                });
            } catch (err) {
                setProfile(null);
            }
        })();
    }, [token]);

    async function startPKCE() {
        // don't run redirects during unit tests
        if (isVitest) return;

        function generateRandomString(length: number) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        async function generateCodeChallenge(codeVerifier: string) {
            const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
            return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        }

        const hashed = generateRandomString(64);
        const codeChallenge = await generateCodeChallenge(hashed);
        localStorage.setItem('code_verifier', hashed);

        const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
        const authUrl = new URL(authorizationEndpoint);
        const params = {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: callbackURL,
        } as Record<string, string>;
        authUrl.search = new URLSearchParams(params).toString();
        console.debug('[useAuth] redirecting to Spotify auth URL', authUrl.toString());
        window.location.href = authUrl.toString();
    }

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
        console.debug('[useAuth] token:', Boolean(token), 'code present:', Boolean(code), 'callbackURL:', callbackURL);
        if (code && !token) {
            void exchangeCodeForToken(code);
            return;
        }

        // If no code and no token on initial mount, start PKCE flow (redirect to Spotify)
        if (!code && !token) {
            void startPKCE();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Watch token and always redirect to Spotify auth flow whenever the token becomes falsy.
    useEffect(() => {
        if (token) return;
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
            void startPKCE();
        }
    }, [token]);

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
        profile,
        exchangeCodeForToken,
        refreshAccessToken,
        clearAuth,
    } as const;
}

export default useAuth;
