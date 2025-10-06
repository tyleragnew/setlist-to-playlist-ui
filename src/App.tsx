import { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { ArtistMetadata, ChooseArtist } from './pages/ChooseArtist'
import { StepHeader } from './components/StepHeader';
import { SetSetlistMetadata } from './pages/SetSetlistMetadata';
import ListenerContext, { PlaylistMetadata, SetlistMetadata } from './context/ListenerContext';
import { useAuth } from './hooks/useAuth';

import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ReviewPlaylist } from './pages/ReviewPlaylist';

// re-use ListenerContext and associated types from src/context/ListenerContext

function App() {

  const { token } = useAuth();

  // Authentication handled by useAuth hook

  const [chosenArtist, setChosenArtist] = useState<ArtistMetadata | null>(null);
  const [playlistMetadata, setPlaylistMetadata] = useState<PlaylistMetadata | null>(null);
  const [setlistMetadata, setSetlistMetadata] = useState<SetlistMetadata | null>(null);
  const [setlistLoaded, setSetlistLoaded] = useState<boolean>(false);

  return (
    <>
      <ListenerContext.Provider
        value={{
          chosenArtist,
          setChosenArtist,
          token,
          playlistMetadata,
          setPlaylistMetadata,
          setlistMetadata,
          setSetlistMetadata,
          setlistLoaded,
          setSetlistLoaded,
        }}>
        <ChakraProvider>
          <StepHeader />
          <br />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ChooseArtist />} />
              <Route path="/callback" element={<ChooseArtist />} />
              <Route path="/setlistMetadata" element={<SetSetlistMetadata />} />
              <Route path="/playlist" element={<ReviewPlaylist />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </ListenerContext.Provider >
    </>
  )

}

export default App
