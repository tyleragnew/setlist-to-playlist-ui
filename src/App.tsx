import { useState, useEffect } from 'react';
import { ChakraProvider, Box, Button, Text, localStorageManager } from '@chakra-ui/react'
import { SpotifyProfile } from './components/SpotifyProfile';
import theme from './theme'
import { ArtistMetadata, ChooseArtist } from './pages/ChooseArtist'
import { StepHeader } from './components/StepHeader';
import { StepProvider } from './context/StepContext';
import { SetSetlistMetadata } from './pages/SetSetlistMetadata';
import ListenerContext, { PlaylistMetadata, SetlistMetadata } from './context/ListenerContext';
import { useAuth } from './hooks/useAuth';

import './App.css'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ReviewPlaylist } from './pages/ReviewPlaylist';
import { Callback } from './pages/Callback';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, profile, startLogin } = useAuth();

  const [chosenArtist, setChosenArtist] = useState<ArtistMetadata | null>(null);
  const [playlistMetadata, setPlaylistMetadata] = useState<PlaylistMetadata | null>(null);
  const [setlistMetadata, setSetlistMetadata] = useState<SetlistMetadata | null>(null);
  const [setlistLoaded, setSetlistLoaded] = useState<boolean>(false);

  // Scroll to top on route change — blur any focused input first (dismisses iOS keyboard)
  // then force scroll reset on all possible scroll containers
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Double rAF ensures iOS Safari has fully laid out the new page
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
  }, [location.pathname]);

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
          <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
            <Box bg='bg.page' minH={{ base: '100dvh', md: '100vh' }} display='flex' flexDirection='column' alignItems='center'>
              <Box w={{ base: '92%', md: '100%' }} maxW='960px' display='flex' flexDirection='column' flex='1' mt={{ base: 4, md: 8 }}>
                {token && profile ? (
                  <SpotifyProfile image={profile.image ?? undefined} displayName={profile.displayName} />
                ) : (
                  <>
                    <Box display='flex' justifyContent='space-between' alignItems='flex-start' w='100%' py={3}>
                      <Text
                        fontSize={{ base: '1.5rem', md: '1.75rem' }}
                        fontWeight='800'
                        color='accent.green'
                        letterSpacing='tight'
                        fontFamily="'Inter', system-ui, sans-serif"
                        cursor='pointer'
                        onClick={() => navigate('/')}
                        _hover={{ opacity: 0.8 }}
                        transition='opacity 0.15s ease'
                        lineHeight='1'
                        mt='2px'
                      >
                        Setlist
                        <Text as='span' color='text.primary'>2</Text>
                        Playlist
                      </Text>
                      <Box display='flex' flexDirection='column' alignItems='flex-end' gap={1}>
                        <Button
                          size='sm'
                          variant='outline'
                          borderColor='accent.green'
                          color='accent.green'
                          borderRadius='full'
                          fontWeight='semibold'
                          _hover={{ bg: 'rgba(29,185,84,0.1)' }}
                          onClick={() => startLogin()}
                        >
                          Log in with Spotify
                        </Button>
                        <Text fontSize='2xs' color='text.secondary' fontStyle='italic' fontWeight='normal' opacity={0.5} pr={2}>
                          Limited beta — contact us for access
                        </Text>
                        <Text fontSize='2xs' color='text.secondary' fontStyle='italic' fontWeight='normal' opacity={0.5} pr={2}>
                          No login required
                        </Text>
                      </Box>
                    </Box>
                  </>
                )}
                <StepHeader />
                <Box flex='1' display='flex' flexDirection='column' justifyContent='flex-start' pb={{ base: 20, md: 16 }}>
                  <Routes>
                    <Route path="/" element={<ChooseArtist />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/setlistMetadata" element={<SetSetlistMetadata />} />
                    <Route path="/playlist" element={<ReviewPlaylist />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          </ChakraProvider>
        </StepProvider>
      </ListenerContext.Provider>
    </>
  );
}

export default App
