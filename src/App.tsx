import React, { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { ArtistMetadata, ChooseArtist } from './pages/ChooseArtist'
import { StepHeader } from './components/StepHeader';
import { SetSetlistMetadata } from './pages/SetSetlistMetadata';

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ReviewPlaylist } from './pages/ReviewPlaylist';

export const ListenerContext = React.createContext(null);

function App() {

  const [token, setToken] = useState("")

  const clientId: string = "d74b3ce0fbf342ecbfc8b32423800fa2";
  const authorizationEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const callbackURL = "https://setlist-to-playlist-ui.vercel.app/callback"

  useEffect(() => {
    if (!localStorage.getItem('code_verifier')) {
      generateCodeVerifier(clientId);
    } else {
      getAccessToken();
    }

    async function getAccessToken() {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get('code');
      let codeVerifier = localStorage.getItem('code_verifier');

      const payload: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code ?? '',
          redirect_uri: callbackURL,
          code_verifier: codeVerifier ?? ''
        }),
      };

      const body = await fetch(tokenEndpoint, payload);
      const response = await body.json();

      localStorage.setItem('access_token', response.access_token);
      setToken(response.access_token);
    }

    async function generateCodeVerifier(clientId: string) {

      function generateRandomString(length: number) {
        let text = '';
        const possible =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

      async function generateCodeChallenge(codeVerifier: any) {
        const digest = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(codeVerifier),
        );

        return btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }

      const hashed = generateRandomString(64)
      const codeChallenge = await generateCodeChallenge(hashed);

      // Store code_verifier for use in getting an access token
      localStorage.setItem('code_verifier', hashed)

      const scope = "user-read-private user-read-email playlist-modify-public playlist-modify-private";
      const authUrl = new URL(authorizationEndpoint)
      const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: callbackURL,
      };
      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
    }
  }, []);

  const [chosenArtist, setChosenArtist] = useState<ArtistMetadata | null>();
  const [playlistMetadata, setPlaylistMetadata] = useState<any>();
  const [setlistMetadata, setSetlistMetadata] = useState<any>();
  const [setlistLoaded, setSetlistLoaded] = useState<false>();

  return (
    <>
      <ListenerContext.Provider
        //@ts-ignore
        value={{
          chosenArtist,
          setChosenArtist,
          token,
          playlistMetadata,
          setPlaylistMetadata,
          setlistMetadata,
          setSetlistMetadata,
          setlistLoaded,
          setSetlistLoaded
        }}>
        <ChakraProvider>
          <StepHeader />
          <br />
          <BrowserRouter>
            <Routes>
              <Route index path="/callback" element={<ChooseArtist />} />
              <Route path="/setlistMetadata" element={<SetSetlistMetadata />} />
              <Route path="/playlist" element={<ReviewPlaylist />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </ListenerContext.Provider >
    </>
  )

}

export default App
