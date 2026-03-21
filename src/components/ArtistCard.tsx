import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArtistMetadata } from "../pages/ChooseArtist";
import { useListenerContext } from "../context/ListenerContext";

type ArtistCardProps = {
    artist: ArtistMetadata;
};

export function ArtistCard({ artist }: ArtistCardProps) {
    const navigate = useNavigate();
    const { setChosenArtist } = useListenerContext();

    const handleClick = (a: ArtistMetadata) => {
        setChosenArtist(a);
        navigate('/setlistMetadata');
    };

    return (
        <Box
            w='100%'
            bg='bg.card'
            border='1px solid'
            borderColor='border.subtle'
            borderRadius='xl'
            p={4}
            display='flex'
            flexDirection='row'
            alignItems='center'
            gap={4}
            transition='all 0.2s ease'
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderColor: 'accent.green',
            }}
            cursor='pointer'
        >
            {artist.imageUrl && (
                <Box
                    boxSize='56px'
                    borderRadius='full'
                    overflow='hidden'
                    flexShrink={0}
                    border='2px solid'
                    borderColor='border.subtle'
                    transition='border-color 0.2s ease'
                    _groupHover={{ borderColor: 'accent.green' }}
                >
                    <img
                        src={artist.imageUrl}
                        alt={artist.artistName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>
            )}
            <Box flex='1' minW={0}>
                <Text fontWeight='bold' fontSize='lg' color='text.primary' noOfLines={1}>
                    {artist.artistName}
                </Text>
                <Text fontSize='sm' color='text.muted' fontStyle='italic' mb={0.5} noOfLines={1}>
                    {artist.location}
                </Text>
                <Text fontSize='sm' color='text.muted' noOfLines={2}>
                    {artist.description}
                </Text>
            </Box>
            <Button
                onClick={() => handleClick(artist)}
                size='sm'
                colorScheme='spotify'
                fontWeight='bold'
                px={5}
                borderRadius='full'
                flexShrink={0}
            >
                Select
            </Button>
        </Box>
    );
}
