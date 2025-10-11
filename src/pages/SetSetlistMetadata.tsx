import { Button, FormControl, Radio, RadioGroup, Stack, Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useListenerContext } from "../context/ListenerContext";
import { ProjectedSetlist } from "../components/ProjectedSetlist";
import { useSetStep } from '../context/StepContext'

export function SetSetlistMetadata() {
    const { chosenArtist, setSetlistMetadata } = useListenerContext();
    const setStep = useSetStep();
    useEffect(() => { setStep(1); }, [setStep]);
    const [setlistLoaded, setSetlistLoaded] = useState(false);

    // Number of sets slider state
    const [numberOfSets, setNumberOfSets] = useState(10);

    // @TODO - add debouncing here instead of using OnBlur event.
    const fetchData = async () => {
        if (!chosenArtist) return;
        try {
            const response = await fetch(
                `https://setlist-to-playlist-api.vercel.app/setlists?artistMBID=${chosenArtist.mbid}&numberOfSets=${numberOfSets}`
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
                {/* Artist image removed */}
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold' color='spotify.white' textAlign='center' mb={2}>
                    {chosenArtist?.artistName ?? 'Selected Artist'}
                </Text>
                <Text fontSize='md' color='spotify.green' textAlign='center' mb={4}>
                    Include the last X sets for {chosenArtist?.artistName ?? 'the artist'}
                </Text>
                <FormControl mb={2}>
                    <Text fontSize='md' color='spotify.white' mb={2} textAlign='center'>
                        Number of sets: <b>{numberOfSets}</b>
                    </Text>
                    <Box px={2} mb={3}>
                        {/* Slider for 5, 10, 20 */}
                        <Box position='relative'>
                            <input
                                type='range'
                                min={0}
                                max={2}
                                step={1}
                                value={[5, 10, 20].indexOf(numberOfSets)}
                                onChange={e => setNumberOfSets([5, 10, 20][parseInt(e.target.value)])}
                                style={{ width: '100%' }}
                            />
                            <Box display='flex' justifyContent='space-between' mt={1} px={1}>
                                <Text fontSize='sm' color='spotify.green'>5</Text>
                                <Text fontSize='sm' color='spotify.green'>10</Text>
                                <Text fontSize='sm' color='spotify.green'>20</Text>
                            </Box>
                        </Box>
                    </Box>
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
