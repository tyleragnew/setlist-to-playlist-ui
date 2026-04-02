import { useNavigate } from "react-router-dom";
import { Button, Box, Text, Divider } from "@chakra-ui/react";
import { useListenerContext, SongEntry } from "../context/ListenerContext";

type ProjectedSetlistProps = {
    includeTape?: boolean;
    breakupMedleys?: boolean;
    preferLive?: boolean;
    playlistDescription?: string;
    showSimilarity?: boolean;
    showCountLabel?: string | null;
};

export function ProjectedSetlist({ includeTape = true, breakupMedleys = false, preferLive = false, playlistDescription, showSimilarity = true, showCountLabel = null }: ProjectedSetlistProps) {
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
                        ...(token ? { 'api-key': token } : {}),
                    },
                    body: JSON.stringify({
                        ...setlistMetadata,
                        songs,
                        artistName: chosenArtist?.artistName,
                        artistImageUrl: chosenArtist?.imageUrl,
                        playlistDescription,
                        preferLive,
                    }),
                },
            );

            const jsonData = await response.json();
            if (!response.ok) {
                setPlaylistMetadata({ error: jsonData.message || 'Something went wrong' });
                setSetlistLoaded(true);
                return;
            }
            setPlaylistMetadata({ ...jsonData, playlistDescription });
            setSetlistLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setPlaylistMetadata({ error: 'Something went wrong. Please try again.' });
            setSetlistLoaded(true);
        }
    };

    const allSongs = setlistMetadata?.songs ?? [];
    const filtered = includeTape ? allSongs : allSongs.filter(s => !s.tape && !s.coverArtist);
    const songs = breakupMedleys
        ? filtered.flatMap(s =>
            s.title.includes(' / ')
                ? s.title.split(' / ').map(t => ({ ...s, title: t.trim() }))
                : [s]
        ).filter((s, i, arr) => arr.findIndex(x => x.title.toUpperCase() === s.title.toUpperCase()) === i)
        : filtered;
    const similarity = setlistMetadata?.similarity;

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' alignItems='baseline' mb={3}>
                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide'>
                    {songs.length} song{songs.length !== 1 ? 's' : ''}
                </Text>
                {showSimilarity && similarity != null && (
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
            {showSimilarity && similarity != null && (
                <Box display='flex' alignItems='flex-start' gap={2} mb={3}>
                    <Box
                        flexShrink={0}
                        boxSize='16px'
                        borderRadius='full'
                        border='1px solid'
                        borderColor='text.muted'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        mt='1px'
                    >
                        <Text fontSize='10px' fontWeight='bold' color='text.muted' lineHeight='1'>
                            i
                        </Text>
                    </Box>
                    <Text fontSize='xs' color='text.muted' lineHeight='tall' >
                        {similarity >= 70
                            ? 'This artist plays a pretty consistent set every night. What you see is likely what you\'ll get.'
                            : similarity >= 40
                                ? 'This artist switches things up a bit. Your playlist covers the highlights but expect some surprises.'
                                : 'This artist loves to mix it up. Think of this playlist as a best guess, not a guarantee.'
                        }
                    </Text>
                </Box>
            )}
            {showCountLabel && (
                <Text fontSize='xs' color='text.muted' mb={3} noOfLines={1}>
                    {showCountLabel}
                </Text>
            )}
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
                isDisabled={songs.length === 0}
                colorScheme='spotify'
                size='lg'
                w='100%'
                borderRadius='full'
                fontWeight='bold'
                fontSize='md'
            >
                {token ? 'Generate & Save to Spotify' : 'Generate Playlist'}
            </Button>
        </Box>
    );
}
