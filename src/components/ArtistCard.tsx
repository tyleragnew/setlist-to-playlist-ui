import { Button, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import { ListenerContext } from "../App";
import { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { ArtistMetadata } from "../pages/ChooseArtist";

//@ts-ignore
export function ArtistCard({ artist }) {

    const navigate = useNavigate();

    const handleClick = (artist: ArtistMetadata) => {
        setChosenArtist(artist);
        navigate('/setlistMetadata');
    };

    // @ts-ignore
    const { chosenArtist, setChosenArtist } = useContext(ListenerContext)

    return (
        <Card >
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
    )
}