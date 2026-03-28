import { useNavigate } from "react-router-dom";
import { Button, Box, Text, Divider } from "@chakra-ui/react";
import { useListenerContext, SongEntry } from "../context/ListenerContext";

export function ProjectedSetlist() {
    const { setlistMetadata, chosenArtist, token, setSetlistLoaded, setPlaylistMetadata } = useListenerContext();
    const navigate = useNavigate();

    const handleClick = () => {
        setPlaylistMetadata(null);
        setSetlistLoaded(false);
        navigate("/playlist");
        void fetchData();
    };

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/playlists`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': `${token}`,
                    },
                    body: JSON.stringify({
                        ...setlistMetadata,
                        artistName: chosenArtist?.artistName,
                    }),
                },
            );

            const jsonData = await response.json();
            setPlaylistMetadata(jsonData);
            setSetlistLoaded(true);
        } catch (error) {
            // keep error as unknown and log safely
            console.error('Error fetching data:', error);
        }
    };

    const songs = setlistMetadata?.songs ?? [];
    const similarity = setlistMetadata?.similarity;

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' alignItems='baseline' mb={3}>
                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide'>
                    {songs.length} song{songs.length !== 1 ? 's' : ''}
                </Text>
                {similarity != null && (
                    <Box display='flex' alignItems='baseline' gap={1.5}>
                        <Text fontSize='xs' color='text.muted' textTransform='uppercase' letterSpacing='wide'>
                            Setlist Similarity
                        </Text>
                        <Text
                            fontSize='sm'
                            fontWeight='bold'
                            color={similarity >= 70 ? 'accent.green' : similarity >= 40 ? 'orange.400' : 'red.400'}
                        >
                            {similarity}%
                        </Text>
                    </Box>
                )}
            </Box>
            <Box
                bg='bg.page'
                borderRadius='lg'
                border='1px solid'
                borderColor='border.subtle'
                overflow='hidden'
                mb={4}
                maxH='320px'
                overflowY='auto'
            >
                {songs.map((song: SongEntry, index: number) => (
                    <Box key={index}>
                        <Box
                            display='flex'
                            alignItems='center'
                            px={4}
                            py={2.5}
                            gap={3}
                            _hover={{ bg: 'border.subtle' }}
                            transition='background-color 0.15s ease'
                        >
                            <Text fontSize='sm' color='text.muted' w='24px' textAlign='right' flexShrink={0}>
                                {index + 1}
                            </Text>
                            <Text fontSize='sm' color='text.primary' flex='1' noOfLines={1}>
                                {song.title}
                                {song.coverArtist && (
                                    <Text as='span' fontSize='xs' color='text.muted' ml={2}>
                                        ({song.coverArtist} cover)
                                    </Text>
                                )}
                            </Text>
                        </Box>
                        {index < songs.length - 1 && <Divider borderColor='border.subtle' />}
                    </Box>
                ))}
            </Box>
            {songs.length === 0 && (
                <Text fontSize='sm' color='orange.400' textAlign='center' mb={3}>
                    No setlist data found for this artist. Try including more sets.
                </Text>
            )}
            <Button
                onClick={handleClick}
                isDisabled={!token || songs.length === 0}
                title={!token ? 'Sign in to Spotify to generate playlist' : undefined}
                colorScheme='spotify'
                size='lg'
                w='100%'
                borderRadius='full'
                fontWeight='bold'
                fontSize='md'
            >
                Generate & Save to Spotify
            </Button>
        </Box>
    );
}
