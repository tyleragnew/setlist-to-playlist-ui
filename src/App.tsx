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
  const urlParams = new URLSearchParams(window.location.search);
  let code: any | null = urlParams.get('code');
  const CALLBACK_URL = "https://setlist-to-playlist-ui.vercel.app/callback"

  useEffect(() => {
    if (!token) {
      console.log("No Token")
      if (!code) {
        console.log("No Code...getting access Token")
        redirectToAuthCodeFlow(clientId);
        getAccessToken();
      } else {
        console.log("Yes Code: " + code)
        getAccessToken();
      }

      async function getAccessToken() {

        console.log("getting access token")

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
            redirect_uri: CALLBACK_URL,
            code_verifier: codeVerifier ?? ''
          }),
        };

        const body = await fetch("https://accounts.spotify.com/api/token", payload);
        const response = await body.json();

        console.log("API Token response: " + response)

        localStorage.setItem('access_token', response.access_token);
        setToken(response.access_token);
      }

      async function redirectToAuthCodeFlow(clientId: string) {

        // Generate a random code verifier
        const generateCodeVerifier = () => {
          const array = new Uint32Array(56); // 56 random bytes
          window.crypto.getRandomValues(array);
          return Array.from(array, dec => dec.toString(36)).join('');
        }

        async function generateCodeChallenge(codeVerifier: string): Promise<string> {
          const encoded = new TextEncoder().encode(codeVerifier);
          const hashed = await crypto.subtle.digest('SHA-256', encoded);

          // Convert the hash to a Base64-encoded string and make it URL-safe
          return btoa(String.fromCharCode(...new Uint8Array(hashed))) // Base64 encode
            .replace(/\+/g, '-') // URL-safe encoding
            .replace(/\//g, '_') // URL-safe encoding
            .replace(/=+$/, ''); // Remove trailing '='
        }

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const scope = "user-read-private user-read-email playlist-modify-public playlist-modify-private";
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        window.localStorage.setItem('code_verifier', codeVerifier);

        const params = {
          response_type: 'code',
          client_id: clientId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: CALLBACK_URL,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
      }
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
