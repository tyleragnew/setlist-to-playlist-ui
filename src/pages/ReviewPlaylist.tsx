import { AspectRatio, Button, SimpleGrid, Spinner } from "@chakra-ui/react";
import { ThemedHeader } from "../components/ThemedHeader";
import { useListenerContext } from "../context/ListenerContext";
import { useNavigate } from "react-router-dom";
import { useSetStep } from '../context/StepContext'
import { useEffect } from 'react'

export function ReviewPlaylist() {
    const navigate = useNavigate();
    const { setlistLoaded, chosenArtist, playlistMetadata } = useListenerContext();

    const setStep = useSetStep()
    useEffect(() => {
        setStep(2)
    }, [setStep])

    return (
        <>
            {setlistLoaded ? (
                <SimpleGrid alignItems='center'>
                    <br />
                    <ThemedHeader>
                        Here's your setlist for {chosenArtist?.artistName ?? 'the artist'}
                    </ThemedHeader>
                    <AspectRatio alignItems='center' maxW='800px' ratio={1}>
                        <iframe
                            src={(playlistMetadata?.embedURL ?? '').toString()}
                            width="100%"
                            height="352"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </AspectRatio>
                    <br />
                    {(playlistMetadata?.unmappedSongs ?? []).length > 0 ? (
                        <div>
                            <h3>Unfortunately we weren't able to map the following songs...</h3>
                            {(playlistMetadata?.unmappedSongs ?? []).map((i: string, index: number) => (
                                <p key={index}>{i}</p>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <h3>All songs were mapped successfully!</h3>
                        </div>
                    )}
                    <br />
                    <Button onClick={() => navigate('/')}>Create Another</Button>
                </SimpleGrid>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '352px', maxWidth: '800px', margin: '0 auto' }}>
                    <Spinner thickness="6px" speed="0.8s" emptyColor="gray.200" color="spotify.green" size="xl" width="100%" height="352px" />
                </div>
            )}
        </>
    );
}
