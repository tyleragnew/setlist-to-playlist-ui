import { useNavigate } from "react-router-dom";
import { Button, Box, Text, Divider } from "@chakra-ui/react";
import { useListenerContext } from "../context/ListenerContext";

export function ProjectedSetlist() {
    const { setlistMetadata, token, setSetlistLoaded, setPlaylistMetadata } = useListenerContext();
    const navigate = useNavigate();

    const handleClick = () => {
        void fetchData();
        navigate("/playlist");
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
                    body: JSON.stringify(setlistMetadata ?? {}),
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

    return (
        <Box>
            <Text fontSize='xs' fontWeight='semibold' color='text.muted' mb={3} textTransform='uppercase' letterSpacing='wide'>
                {songs.length} song{songs.length !== 1 ? 's' : ''}
            </Text>
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
                {songs.map((song: string, index: number) => (
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
                                {song}
                            </Text>
                        </Box>
                        {index < songs.length - 1 && <Divider borderColor='border.subtle' />}
                    </Box>
                ))}
            </Box>
            <Button
                onClick={handleClick}
                isDisabled={!token}
                title={!token ? 'Sign in to Spotify to generate playlist' : undefined}
                colorScheme='spotify'
                size='lg'
                w='100%'
                borderRadius='full'
                fontWeight='bold'
                fontSize='md'
            >
                Generate My Playlist!
            </Button>
        </Box>
    );
}
