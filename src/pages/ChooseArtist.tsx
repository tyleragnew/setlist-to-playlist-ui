import { Input, SimpleGrid } from "@chakra-ui/react";
import { Key, useEffect, useState } from "react";
import { ArtistCard } from "../components/ArtistCard";


export type ArtistMetadata = {
    artistName: string
    description: string
    mbid: string
    location: string
}

export function ChooseArtist() {


    const [listOfArtists, setListofArtists] = useState<ArtistMetadata[]>();
    // Component State
    const [artistInput, setArtistInput] = useState('');

    const handleChange = async (event: any) => {
        setArtistInput(event.target.value)
    }

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchData()
        }, 400);
        return () => clearTimeout(debounceTimeout);
    }, [artistInput]);

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
            <SimpleGrid columns={3} spacing='5'>
                {listOfArtists?.length ?? 0 ? (listOfArtists!.map((i: ArtistMetadata, index: Key | null | undefined) => (
                    <ArtistCard
                        key={index}
                        artist={i}
                    />
                ))
                ) : (
                    <p>No data available.</p>
                )}
            </SimpleGrid>
        </>
    );
}
