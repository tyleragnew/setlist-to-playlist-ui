import { useContext } from "react";
import { ListenerContext } from "../App";
import { Button, OrderedList, ListItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function ProjectedSetlist() {

    //@ts-ignore
    const { setlistMetadata, token, setSetlistLoaded, setPlaylistMetadata } = useContext(ListenerContext)

    const navigate = useNavigate();

    const handleClick = () => {
        fetchData()
        navigate("/playlist")
    }

    const fetchData = async () => {
        console.log("setlist metadata");
        console.log(setlistMetadata)
        console.log(token)
        try {
            const response = await fetch(
                `http://localhost:3000/playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': `${token}`
                },
                body: JSON.stringify(setlistMetadata)
            })
            const jsonData = await response.json();
            setPlaylistMetadata(jsonData);
            setSetlistLoaded(true)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <OrderedList>
                {setlistMetadata.songs.map
                    //@ts-ignore
                    ((song, index) => {
                        return <ListItem key={index}>{song}</ListItem>
                    })}
            </OrderedList>
            <br />
            <Button onClick={() => handleClick()}>Generate My Playlist!</Button>
        </>
    )

}