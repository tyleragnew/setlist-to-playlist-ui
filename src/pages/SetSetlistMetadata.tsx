import { Button, FormControl, Radio, RadioGroup, Stack, Box, Text, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useListenerContext } from "../context/ListenerContext";
import { ProjectedSetlist } from "../components/ProjectedSetlist";
import { useSetStep } from '../context/StepContext'

export function SetSetlistMetadata() {
    const { chosenArtist, setSetlistMetadata, token } = useListenerContext();
    const setStep = useSetStep();
    const navigate = useNavigate();
    useEffect(() => { setStep(1); }, [setStep]);

    useEffect(() => {
        if (!chosenArtist) navigate('/', { replace: true });
    }, [chosenArtist, navigate]);
    const [setlistLoaded, setSetlistLoaded] = useState(false);

    const [numberOfSets, setNumberOfSets] = useState(10);

    const fetchData = async () => {
        if (!chosenArtist) return;
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/setlists?artistMBID=${chosenArtist.mbid}&numberOfSets=${numberOfSets}`
            );
            const jsonData = await response.json();
            setSetlistMetadata(jsonData);
            setSetlistLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [artistImage, setArtistImage] = useState<string>("");
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchArtistImage() {
            if (!chosenArtist?.artistName) return setArtistImage("");
            setImageLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/artists/image?artist=${encodeURIComponent(chosenArtist.artistName)}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': `${token}`,
                        },
                    }
                );
                const imageUrl = await response.text();
                setArtistImage(typeof imageUrl === 'string' ? imageUrl : "");
            } catch (error) {
                setArtistImage("");
            } finally {
                setImageLoading(false);
            }
        }
        fetchArtistImage();
    }, [chosenArtist, token]);

    return (
        <Stack minH='calc(100vh - 56px)' align='center' justify='flex-start' pt={{ base: 4, md: 8 }} pb={{ base: 2, md: 4 }}>
            <Box
                w='100%'
                bg='bg.card'
                boxShadow={{ base: 'none', md: '0 8px 32px rgba(0,0,0,0.1)' }}
                borderRadius='2xl'
                border='1px solid'
                borderColor='border.subtle'
                p={{ base: 4, md: 8 }}
            >
                {chosenArtist?.artistName && (
                    <Box display="flex" flexDirection="row" alignItems="center" mb={6} justifyContent="center" gap={4}>
                        {imageLoading || !artistImage ? (
                            <Box boxSize="72px" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" stroke="#1DB954" strokeWidth="4" opacity="0.2" />
                                    <path d="M20 4a16 16 0 1 1-16 16" stroke="#1DB954" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </Box>
                        ) : (
                            <Image
                                src={artistImage}
                                alt={chosenArtist.artistName}
                                boxSize="72px"
                                borderRadius="full"
                                border="2px solid"
                                borderColor="accent.green"
                                objectFit="cover"
                                flexShrink={0}
                            />
                        )}
                        <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold' color='text.primary' textAlign='left'>
                            {chosenArtist.artistName}
                        </Text>
                    </Box>
                )}

                <Text fontSize='sm' color='text.muted' textAlign='center' mb={5}>
                    Include the last <Text as='span' color='accent.green' fontWeight='bold'>{numberOfSets}</Text> sets for{' '}
                    <Text as='span' fontWeight='semibold' color='text.primary'>{chosenArtist?.artistName ?? 'the artist'}</Text>
                </Text>

                <Box opacity={setlistLoaded ? 0.6 : 1} transition='opacity 0.3s ease'>
                    <FormControl mb={5}>
                        <Box px={2} mb={4}>
                            <input
                                type='range'
                                min={0}
                                max={2}
                                step={1}
                                value={[5, 10, 20].indexOf(numberOfSets)}
                                onChange={e => setNumberOfSets([5, 10, 20][parseInt(e.target.value)])}
                                style={{ width: '100%', accentColor: '#1DB954' }}
                            />
                            <Box display='flex' justifyContent='space-between' mt={1} px={1}>
                                <Text fontSize='xs' color='text.muted'>5</Text>
                                <Text fontSize='xs' color='text.muted'>10</Text>
                                <Text fontSize='xs' color='text.muted'>20</Text>
                            </Box>
                        </Box>

                        <Box
                            bg='bg.page'
                            borderRadius='xl'
                            border='1px solid'
                            borderColor='border.subtle'
                            p={4}
                            mb={4}
                        >
                            <RadioGroup defaultValue='1'>
                                <Stack spacing={3} direction={{ base: 'column', md: 'row' }} align='center' justify='center'>
                                    <Radio value='1' colorScheme='brand' size='md'>
                                        <Text fontSize='sm' color='text.primary'>Include Songs on Tape</Text>
                                    </Radio>
                                    <Radio value='2' colorScheme='brand' size='md'>
                                        <Text fontSize='sm' color='text.primary'>Don't Include Songs on Tape</Text>
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>

                        <Button
                            colorScheme='spotify'
                            size={setlistLoaded ? 'md' : 'lg'}
                            w='100%'
                            borderRadius='full'
                            fontWeight='bold'
                            onClick={fetchData}
                            disabled={!chosenArtist}
                            variant={setlistLoaded ? 'outline' : 'solid'}
                        >
                            {setlistLoaded ? 'Refresh Setlist' : 'Preview Setlist'}
                        </Button>
                    </FormControl>
                </Box>

                {setlistLoaded && (
                    <Box mt={2} pt={4} borderTop='1px solid' borderColor='border.subtle'>
                        <ProjectedSetlist />
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
