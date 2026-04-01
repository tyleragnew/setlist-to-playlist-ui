import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { BinarySpinner } from "../components/BinarySpinner";
import { useListenerContext } from "../context/ListenerContext";
import { useNavigate } from "react-router-dom";
import { useSetStep } from '../context/StepContext'
import { useEffect } from 'react'

export function ReviewPlaylist() {
    const navigate = useNavigate();
    const { setlistLoaded, chosenArtist, playlistMetadata } = useListenerContext();

    const setStep = useSetStep()
    useEffect(() => {
        setStep(2)
    }, [setStep])

    useEffect(() => {
        if (!chosenArtist) navigate('/', { replace: true });
    }, [chosenArtist, navigate])

    const trackCount = playlistMetadata?.trackCount ?? 0;
    const unmapped = playlistMetadata?.unmappedSongs ?? [];

    return (
        <Box mx='auto' pt={8} pb={4} w='100%' display='flex' flexDirection='column' flex={1}>
            {setlistLoaded && playlistMetadata?.error ? (
                <VStack spacing={5} align='center' pt={16}>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold' color='red.400'>
                        Something went wrong
                    </Text>
                    <Text fontSize='sm' color='text.muted' textAlign='center'>
                        {playlistMetadata.error}
                    </Text>
                    <Button
                        onClick={() => navigate('/')}
                        colorScheme='spotify'
                        variant='outline'
                        borderRadius='full'
                        size='md'
                        px={8}
                    >
                        Try Again
                    </Button>
                </VStack>
            ) : setlistLoaded ? (
                <VStack spacing={5} align='stretch'>
                    <Box>
                        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold' color='text.primary'>
                            {chosenArtist?.artistName} Setlist Playlist
                        </Text>
                        <Text fontSize='sm' color='text.muted'>
                            {trackCount} track{trackCount !== 1 ? 's' : ''}
                            {playlistMetadata?.isGuest
                                ? ' — open in Spotify to save'
                                : ', saved to your Spotify'}
                        </Text>
                        {playlistMetadata?.playlistDescription && (
                            <Text fontSize='xs' color='text.muted' mt={1}>
                                {playlistMetadata.playlistDescription}
                            </Text>
                        )}
                    </Box>

                    <Box
                        borderRadius='2xl'
                        overflow='hidden'
                        border='1px solid'
                        borderColor='border.subtle'
                        boxShadow='0 4px 24px rgba(0,0,0,0.1)'
                    >
                        <iframe
                            src={(playlistMetadata?.embedURL ?? '').toString()}
                            width="100%"
                            height="600"
                            style={{ border: 'none' }}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </Box>

                    {unmapped.length > 0 && (
                        <Box
                            bg='bg.card'
                            border='1px solid'
                            borderColor='border.subtle'
                            borderRadius='xl'
                            p={4}
                        >
                            <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={2}>
                                Not found on Spotify ({unmapped.length})
                            </Text>
                            <VStack align='stretch' spacing={0}>
                                {unmapped.map((song: string, index: number) => (
                                    <Text key={index} fontSize='sm' color='text.muted' py={1}>
                                        {song}
                                    </Text>
                                ))}
                            </VStack>
                        </Box>
                    )}

                    <Button
                        onClick={() => navigate('/')}
                        colorScheme='spotify'
                        variant='outline'
                        borderRadius='full'
                        size='md'
                        alignSelf='center'
                        px={8}
                    >
                        Create Another Playlist
                    </Button>
                </VStack>
            ) : (
                <BinarySpinner size='md' fullScreen />
            )}
        </Box>
    );
}
