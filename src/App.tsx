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

  const clientId = "d74b3ce0fbf342ecbfc8b32423800fa2";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const CALLBACK_URL = "https://setlist-to-playlist-ui.vercel.app/callback"

  useEffect(() => {
    if (!token) {
      console.log("No Token")
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        getAccessToken(clientId, code);
      }

      async function redirectToAuthCodeFlow(clientId: string) {

        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);

        const scope = 'user-read-private user-read-email';
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        // generated in the previous step
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

        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
      }

      const generateRandomString = (length: number) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
      }

      const sha256 = async (plain: string) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
      }

      const base64encode = (input: any) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }

      async function getAccessToken(clientId: string, code: string) {
        const code_verifier = localStorage.getItem("code_verifier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", CALLBACK_URL);
        params.append("code_verifier", code_verifier!);

        const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });

        await result.json().then(res => {
          setToken(res.access_token);
        });
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
