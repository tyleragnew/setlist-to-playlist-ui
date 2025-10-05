import { AspectRatio, Button, SimpleGrid, Spinner } from "@chakra-ui/react";
import { ListenerContext } from "../App"
import { useContext } from 'react'
import { useNavigate } from "react-router-dom";

export function ReviewPlaylist() {

    const navigate = useNavigate();

    // @ts-ignore
    const { setlistLoaded, setlist, chosenArtist, playlistMetadata } = useContext(ListenerContext);

    return (
        <>
            {setlistLoaded ? (
                <SimpleGrid alignItems='center'>
                    <h1>Here's your setlist for {chosenArtist.artistName}</h1>
                    <AspectRatio alignItems='center' maxW='800px' ratio={1}>
                        <iframe
                            src={playlistMetadata.embedURL.toString()}
                            width="100%"
                            height="352"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </AspectRatio>
                    <br />
                    {playlistMetadata.unmappedSongs.length > 0 ?
                        <div>
                            <h3>Unfortunately we weren't able to map the following songs...</h3>
                            {playlistMetadata.unmappedSongs.map
                                (
                                    //@ts-ignore
                                    (i, index) => {
                                        return (<p key={index}>{i}</p>)
                                    }
                                )
                            }
                        </div> :
                        <div>
                            <h3>All songs were mapped successfully!</h3>
                        </div>
                    }
                    <br />
                    <Button onClick={() => navigate('/callback')}>Create Another</Button>
                </SimpleGrid>
            ) : (
                <Spinner size='xl' />
            )}
        </>
    );
}
