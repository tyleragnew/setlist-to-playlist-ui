import { Box, Input, InputGroup, InputLeftElement, Stack, Text } from "@chakra-ui/react";
import { ThemedHeader } from "../components/ThemedHeader";
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

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

export function ChooseArtist() {

    const setStep = useSetStep()
    useEffect(() => {
        setStep(0)
    }, [setStep])

    const [listOfArtists, setListofArtists] = useState<ArtistMetadata[]>([]);
    const [artistInput, setArtistInput] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArtistInput(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/artists?artist=${artistInput}`
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
        <Box mx='auto' pt={8} pb={4} w='100%'>
            <ThemedHeader mb={6}>Choose Your Artist</ThemedHeader>
            <InputGroup mb={6} size='lg'>
                <InputLeftElement pointerEvents='none' color='text.muted' pl={1}>
                    <SearchIcon />
                </InputLeftElement>
                <Input
                    value={artistInput}
                    placeholder='Search for an artist...'
                    onChange={handleChange}
                    bg='bg.card'
                    borderColor='border.subtle'
                    color='text.primary'
                    _placeholder={{ color: 'text.muted' }}
                    _hover={{ borderColor: 'accent.green' }}
                    _focus={{
                        borderColor: 'accent.green',
                        boxShadow: '0 0 0 1px var(--chakra-colors-accent-green)',
                    }}
                    borderRadius='xl'
                    fontSize='md'
                />
            </InputGroup>
            {listOfArtists.length > 0 ? (
                <Stack spacing={3} w='100%'>
                    {listOfArtists.map((artist, index) => (
                        <ArtistCard key={index} artist={artist} />
                    ))}
                </Stack>
            ) : artistInput.length > 0 ? (
                <Text color='text.muted' textAlign='center' mt={8} fontSize='sm'>
                    No artists found for "{artistInput}"
                </Text>
            ) : (
                <Text color='text.muted' textAlign='center' mt={8} fontSize='sm'>
                    Start typing to search for an artist...
                </Text>
            )}
        </Box>
    );
}
