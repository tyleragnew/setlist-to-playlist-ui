import { Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { useSetStep } from '../context/StepContext'


export type ArtistMetadata = {
    artistName: string
    description: string
    mbid: string
    location: string
    imageUrl?: string
}

export function ChooseArtist() {

    const setStep = useSetStep()
    useEffect(() => {
        setStep(0)
    }, [setStep])



    const [listOfArtists, setListofArtists] = useState<ArtistMetadata[]>([]);
    // Component State
    const [artistInput, setArtistInput] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArtistInput(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://setlist-to-playlist-api.vercel.app/artists?artist=${artistInput}`
                );
                const jsonData = await response.json();
                setListofArtists(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const debounceTimeout = setTimeout(() => {
            void fetchData();
        }, 400);
        return () => clearTimeout(debounceTimeout);
    }, [artistInput]);

    return (
        <>
            <h1>Choose Your Artist...</h1>
            <br />
            <Input
                value={artistInput}
                placeholder='i.e. Genesis...'
                onChange={handleChange}
                size='sm'
            />
            <br />
            <br />
            <Stack spacing={5} width="100%">
                {listOfArtists.length > 0 ? (
                    listOfArtists.map((i, index) => (
                        <ArtistCard key={index} artist={i} />
                    ))
                ) : (
                    <p>No data available.</p>
                )}
            </Stack>
        </>
    );
}
