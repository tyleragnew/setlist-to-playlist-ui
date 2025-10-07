import { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { ArtistMetadata, ChooseArtist } from './pages/ChooseArtist'
import { StepHeader } from './components/StepHeader';
import { StepProvider } from './context/StepContext';
import { SetSetlistMetadata } from './pages/SetSetlistMetadata';
import ListenerContext, { PlaylistMetadata, SetlistMetadata } from './context/ListenerContext';
import { useAuth } from './hooks/useAuth';

import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ReviewPlaylist } from './pages/ReviewPlaylist';
import { Callback } from './pages/Callback';

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
        <StepProvider>
          <ChakraProvider>
            <StepHeader />
            <br />
            <Routes>
              <Route path="/" element={<ChooseArtist />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/setlistMetadata" element={<SetSetlistMetadata />} />
              <Route path="/playlist" element={<ReviewPlaylist />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ChakraProvider>
        </StepProvider>
      </ListenerContext.Provider >
    </>
  )

}

export default App
