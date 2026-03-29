import { Box, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListenerContext } from "../context/ListenerContext";
import { BinarySpinner } from "./BinarySpinner";

type TopArtistEntry = {
    artistName: string;
    mbid: string;
    imageUrl: string | null;
};

export function TopArtists() {
    const { token, setChosenArtist } = useListenerContext();
    const navigate = useNavigate();
    const [artists, setArtists] = useState<TopArtistEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        (async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/artists/top`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': token,
                        },
                    }
                );
                if (!res.ok) return;
                const data = await res.json();
                setArtists(data);
            } catch (err) {
                console.error('Error fetching top artists:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const handleClick = (artist: TopArtistEntry) => {
        setChosenArtist({
            artistName: artist.artistName,
            mbid: artist.mbid,
            description: '',
            location: '',
            imageUrl: artist.imageUrl ?? undefined,
        });
        navigate('/setlistMetadata');
    };

    if (loading) {
        return (
            <Box mt={8}>
                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={4}>
                    Your Top Artists
                </Text>
                <Box display='flex' justifyContent='center' py={6}>
                    <BinarySpinner size='md' />
                </Box>
            </Box>
        );
    }

    if (artists.length === 0) return null;

    return (
        <Box mt={8}>
            <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={4}>
                Your Top Artists
            </Text>
            <Box display='flex' flexDirection='column' gap={2}>
                {artists.map((artist) => (
                    <Box
                        key={artist.mbid}
                        display='flex'
                        alignItems='center'
                        gap={3}
                        p={3}
                        bg='bg.card'
                        border='1px solid'
                        borderColor='border.subtle'
                        borderRadius='xl'
                        cursor='pointer'
                        onClick={() => handleClick(artist)}
                        transition='all 0.2s ease'
                        _hover={{
                            transform: 'translateY(-1px)',
                            borderColor: 'accent.green',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                    >
                        {artist.imageUrl ? (
                            <Image
                                src={artist.imageUrl}
                                alt={artist.artistName}
                                boxSize='44px'
                                borderRadius='full'
                                objectFit='cover'
                                flexShrink={0}
                                border='2px solid'
                                borderColor='border.subtle'
                            />
                        ) : (
                            <Box
                                boxSize='44px'
                                borderRadius='full'
                                bg='bg.page'
                                border='2px solid'
                                borderColor='border.subtle'
                                flexShrink={0}
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                            >
                                <Text fontSize='md' fontWeight='bold' color='text.muted'>
                                    {artist.artistName.charAt(0)}
                                </Text>
                            </Box>
                        )}
                        <Text fontSize='sm' fontWeight='medium' color='text.primary' noOfLines={1} flex={1}>
                            {artist.artistName}
                        </Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
