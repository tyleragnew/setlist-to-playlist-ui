import { AspectRatio, Box, Button, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { ThemedHeader } from "../components/ThemedHeader";
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

    return (
        <Box mx='auto' pt={8} pb={4} w='100%'>
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
                        <AspectRatio ratio={1} maxH='380px'>
                            <iframe
                                src={(playlistMetadata?.embedURL ?? '').toString()}
                                width="100%"
                                height="352"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </AspectRatio>
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
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    minH='352px'
                >
                    <Spinner
                        thickness="4px"
                        speed="0.8s"
                        emptyColor='border.subtle'
                        color='accent.green'
                        size="xl"
                    />
                </Box>
            )}
        </Box>
    );
}
