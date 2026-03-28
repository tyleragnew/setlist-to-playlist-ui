import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { BinarySpinner } from "../components/BinarySpinner";
import { ThemedHeader } from "../components/ThemedHeader";
import { useListenerContext } from "../context/ListenerContext";
import { useNavigate } from "react-router-dom";
import { useSetStep } from '../context/StepContext'
import { useEffect } from 'react'

export function ReviewPlaylist() {
    const navigate = useNavigate();
    const { token, setlistLoaded, chosenArtist, playlistMetadata } = useListenerContext();

    const setStep = useSetStep()
    useEffect(() => {
        setStep(2)
    }, [setStep])

    useEffect(() => {
        if (!token || !chosenArtist) navigate('/', { replace: true });
    }, [token, chosenArtist, navigate])

    return (
        <Box mx='auto' pt={8} pb={4} w='100%' display='flex' flexDirection='column' flex={1}>
            {setlistLoaded ? (
                <VStack spacing={6} align='stretch'>
                    <ThemedHeader>
                        {chosenArtist?.artistName ?? 'Your'}'s Setlist Playlist
                    </ThemedHeader>

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

                    {(playlistMetadata?.unmappedSongs ?? []).length > 0 ? (
                        <Box
                            bg='bg.card'
                            border='1px solid'
                            borderColor='border.subtle'
                            borderRadius='xl'
                            p={5}
                        >
                            <Heading size='sm' color='text.primary' mb={3}>
                                Songs we couldn't find on Spotify
                            </Heading>
                            <VStack align='stretch' spacing={1}>
                                {(playlistMetadata?.unmappedSongs ?? []).map((song: string, index: number) => (
                                    <Text key={index} fontSize='sm' color='text.muted' py={1}>
                                        {song}
                                    </Text>
                                ))}
                            </VStack>
                        </Box>
                    ) : (
                        <Box
                            bg='bg.card'
                            border='1px solid'
                            borderColor='accent.green'
                            borderRadius='xl'
                            p={5}
                            textAlign='center'
                        >
                            <Text color='accent.green' fontWeight='semibold' fontSize='sm'>
                                All songs mapped successfully!
                            </Text>
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
