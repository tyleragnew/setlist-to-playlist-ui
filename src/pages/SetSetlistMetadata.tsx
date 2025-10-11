import { Button, FormControl, Input, Radio, RadioGroup, Stack, Box, Text, Image, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useListenerContext } from "../context/ListenerContext";
import { ProjectedSetlist } from "../components/ProjectedSetlist";
import { useSetStep } from '../context/StepContext'

export function SetSetlistMetadata() {
    const { chosenArtist, setSetlistMetadata } = useListenerContext();
    const setStep = useSetStep();
    useEffect(() => { setStep(1); }, [setStep]);
    const [setlistLoaded, setSetlistLoaded] = useState(false);

    // Artist image state
    const [artistImage, setArtistImage] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    // Fetch artist image from Last.fm
    useEffect(() => {
        if (!chosenArtist?.artistName) return;
        setImageLoading(true);
        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(chosenArtist.artistName)}&api_key=2bcb9d7b2b6b4b7e8e7e8e7e8e7e8e7e&format=json`)
            .then(res => res.json())
            .then(data => {
                const img = data?.artist?.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || null;
                setArtistImage(img);
            })
            .catch(() => setArtistImage(null))
            .finally(() => setImageLoading(false));
    }, [chosenArtist]);

    // @TODO - add debouncing here instead of using OnBlur event.
    const fetchData = async () => {
        if (!chosenArtist) return;
        try {
            const response = await fetch(
                `https://setlist-to-playlist-api.vercel.app/setlists?artistMBID=${chosenArtist.mbid}&numberOfSets=20`
            );
            const jsonData = await response.json();
            setSetlistMetadata(jsonData);
            setSetlistLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Stack minH='calc(100vh - 56px)' align='center' justify='flex-start' px={{ base: 2, md: 0 }} pt={{ base: 4, md: 8 }} pb={{ base: 2, md: 4 }}>
            <Box
                w={{ base: '100%', sm: '90%', md: '540px' }}
                bg='rgba(25,20,20,0.92)'
                boxShadow='0 8px 32px rgba(0,0,0,0.18)'
                borderRadius='2xl'
                p={{ base: 4, md: 8 }}
                style={{ backdropFilter: 'blur(12px)' }}
            >
                {/* Artist image */}
                <Box display='flex' justifyContent='center' alignItems='center' mb={2}>
                    {imageLoading ? (
                        <Spinner size='lg' color='spotify.green' />
                    ) : artistImage ? (
                        <Image
                            src={artistImage}
                            alt={chosenArtist?.artistName}
                            boxSize={{ base: '80px', md: '120px' }}
                            borderRadius='full'
                            objectFit='cover'
                            boxShadow='md'
                            border='3px solid'
                            borderColor='spotify.green'
                            bg='spotify.black'
                        />
                    ) : null}
                </Box>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold' color='spotify.white' textAlign='center' mb={2}>
                    {chosenArtist?.artistName ?? 'Selected Artist'}
                </Text>
                <Text fontSize='md' color='spotify.green' textAlign='center' mb={4}>
                    Include the last X sets for {chosenArtist?.artistName ?? 'the artist'}
                </Text>
                <FormControl mb={2}>
                    <Input type='number' placeholder='Number of sets...' size='lg' bg='spotify.gray' color='spotify.white' border='none' borderRadius='lg' _placeholder={{ color: 'gray.400' }} mb={3} />
                    <RadioGroup defaultValue='1'>
                        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} align='center' justify='center'>
                            <Radio value='1' colorScheme='spotify'>Include Songs on Tape</Radio>
                            <Radio value='2' colorScheme='spotify'>Don't Include Songs on Tape</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>
                <Button
                    colorScheme='spotify'
                    size='lg'
                    w='100%'
                    borderRadius='full'
                    fontWeight='bold'
                    fontSize='lg'
                    boxShadow='0 2px 8px rgba(30,185,84,0.12)'
                    onClick={fetchData}
                    disabled={!chosenArtist}
                >
                    Generate Projected Setlist
                </Button>
                {setlistLoaded ? <Box mt={6}><ProjectedSetlist /></Box> : null}
            </Box>
        </Stack>
    );
}
