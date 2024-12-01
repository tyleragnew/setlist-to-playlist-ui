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
  let postAuthorization: string | null = localStorage.getItem("post_authorization")

  useEffect(() => {
    if (!localStorage.getItem('code_verifier') && (!postAuthorization || postAuthorization === 'no')) {
      generateCodeVerifier(clientId);
    } else if (postAuthorization = 'yes') {
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
          redirect_uri: callbackURL,
          code_verifier: codeVerifier ?? ''
        }),
      };

      const body = await fetch(tokenEndpoint, payload);
      const response = await body.json();

      console.log("API Token response: " + response)

      localStorage.setItem('access_token', response.access_token);
      setToken(response.access_token);
      localStorage.setItem('post_authorization', "no"); // Can now connect directly with the access token
    }

    async function generateCodeVerifier(clientId: string) {

      const generateRandomString = (length: number) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
      }

      const codeVerifier = generateRandomString(64);

      const sha256 = async (plain: any) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
      }

      const base64encode = (input: ArrayBuffer | Uint8Array): string => {
        // If input is an ArrayBuffer, convert it to Uint8Array
        const uint8Array = input instanceof Uint8Array ? input : new Uint8Array(input);

        // Convert the Uint8Array to a binary string
        const string = String.fromCharCode.apply(null, Array.from(uint8Array));

        // Base64 encode and make URL-safe
        return btoa(string)
          .replace(/\+/g, '-') // Replace '+' with '-'
          .replace(/\//g, '_') // Replace '/' with '_'
          .replace(/=+$/, '');  // Remove any trailing '='
      };

      const hashed = await sha256(codeVerifier)
      const codeChallenge = base64encode(hashed);

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
