import { useNavigate } from "react-router-dom";
import { Button, OrderedList, ListItem } from "@chakra-ui/react";
import { useListenerContext } from "../App";

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
                `https://setlist-to-playlist-api.vercel.app/playlists`,
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

    return (
        <>
            <OrderedList>
                {(setlistMetadata?.songs ?? []).map((song, index) => (
                    <ListItem key={index}>{song}</ListItem>
                ))}
            </OrderedList>
            <br />
            <Button onClick={handleClick}>Generate My Playlist!</Button>
        </>
    );
}