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
        <Card>
            <CardBody textAlign="left">
                <Flex justifyContent="space-between" alignItems="center">
                    <div>
                        <Text size='lg' fontWeight='bold'>{artist.artistName}</Text>
                        <Text size='lg' fontStyle='italic'>{artist.location}</Text>
                        <Text>{artist.description}</Text>
                    </div>
                    <Button onClick={() => handleClick(artist)}>Select</Button>
                </Flex>
            </CardBody>
        </Card>
    );
}