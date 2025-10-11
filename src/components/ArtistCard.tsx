import { Button, Card, CardBody, Flex, Text } from "@chakra-ui/react";
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
        <Card width='100%' minHeight='120px' p={0}>
            <CardBody
                textAlign="left"
                display='flex'
                flexDirection='column'
                justifyContent='flex-start'
                height='100%'
                p={4}
            >
                <Flex direction='row' alignItems='center' mb={1} gap={3}>
                    {artist.imageUrl && (
                        <img
                            src={artist.imageUrl}
                            alt={artist.artistName}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: 12,
                            }}
                        />
                    )}
                    <Text size='lg' fontWeight='bold' flex='1'>{artist.artistName}</Text>
                    <Button
                        onClick={() => handleClick(artist)}
                        size='md'
                        colorScheme='spotify'
                        fontWeight='bold'
                        px={6}
                        py={2}
                        borderRadius='full'
                        boxShadow='md'
                        fontSize='lg'
                        alignSelf='center'
                    >
                        Select
                    </Button>
                </Flex>
                <Text size='lg' fontStyle='italic' mb={0.5}>{artist.location}</Text>
                <Text noOfLines={2} mb={0}>{artist.description}</Text>
            </CardBody>
        </Card>
    );
}