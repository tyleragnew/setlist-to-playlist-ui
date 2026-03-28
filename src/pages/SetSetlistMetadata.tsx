import { Button, FormControl, Box, Text, Image, Divider, Switch, Stack } from "@chakra-ui/react";
import { BinarySpinner } from "../components/BinarySpinner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useListenerContext } from "../context/ListenerContext";
import { ProjectedSetlist } from "../components/ProjectedSetlist";
import { useSetStep } from '../context/StepContext'

type ShowInfo = {
    date: string;
    venue: string;
    city: string;
    country: string;
    tourName: string | null;
};

type ArtistShowMeta = {
    artistName: string;
    currentTour: string | null;
    recentShows: ShowInfo[];
};

function formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

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
    const [allSongs, setAllSongs] = useState(false);

    const [showMeta, setShowMeta] = useState<ArtistShowMeta | null>(null);

    useEffect(() => {
        if (!chosenArtist?.mbid) return;
        (async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/setlists/meta?artistMBID=${chosenArtist.mbid}`
                );
                if (!res.ok) return;
                const json = await res.json();
                setShowMeta(json);
            } catch (err) {
                console.error('Error fetching show meta:', err);
            }
        })();
    }, [chosenArtist]);

    const fetchData = async () => {
        if (!chosenArtist) return;
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/setlists?artistMBID=${chosenArtist.mbid}&numberOfSets=${numberOfSets}&allSongs=${allSongs}`
            );
            const jsonData = await response.json();
            setSetlistMetadata(jsonData);
            setSetlistLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [artistImage, setArtistImage] = useState<string>("");
    const [imageLoading, setImageLoading] = useState<boolean>(true);

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

    if (imageLoading) {
        return <BinarySpinner size='md' fullScreen />;
    }

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
                        {!artistImage ? null : (
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

                {showMeta && (
                    <Box mb={6}>
                        <Box textAlign='center' mb={4}>
                            <Text fontSize='xs' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={1}>
                                Tour Status
                            </Text>
                            {showMeta.currentTour ? (
                                <Text fontSize='md' fontWeight='bold' color='accent.green'>
                                    {showMeta.currentTour}
                                </Text>
                            ) : (
                                <Text fontSize='md' fontWeight='medium' color='text.muted'>
                                    Not currently touring
                                </Text>
                            )}
                        </Box>

                        {showMeta.recentShows.length > 0 && (
                            <Box bg='bg.page' borderRadius='xl' border='1px solid' borderColor='border.subtle' p={4}>
                                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                                    Recent Shows
                                </Text>
                                {showMeta.recentShows.map((show, i) => (
                                    <Box key={i}>
                                        <Box display='flex' justifyContent='space-between' alignItems='baseline' py={1.5}>
                                            <Box>
                                                <Text fontSize='sm' color='text.primary' fontWeight='medium'>
                                                    {show.city}{show.country ? `, ${show.country}` : ''}
                                                </Text>
                                                <Text fontSize='xs' color='text.muted'>{show.venue}</Text>
                                            </Box>
                                            <Text fontSize='xs' color='text.muted' flexShrink={0} ml={3}>
                                                {formatDate(show.date)}
                                            </Text>
                                        </Box>
                                        {i < showMeta.recentShows.length - 1 && <Divider borderColor='border.subtle' />}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}

                <Box opacity={setlistLoaded ? 0.6 : 1} transition='opacity 0.3s ease'>
                    <FormControl mb={5}>
                        <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                            Number of Shows to Analyze
                        </Text>
                        <Box display='flex' gap={2} mb={5}>
                            {[5, 10, 20].map((n) => (
                                <Box
                                    key={n}
                                    as='button'
                                    flex='1'
                                    py={2.5}
                                    borderRadius='xl'
                                    fontWeight='bold'
                                    fontSize='sm'
                                    textAlign='center'
                                    cursor='pointer'
                                    transition='all 0.15s ease'
                                    bg={numberOfSets === n ? 'accent.green' : 'bg.page'}
                                    color={numberOfSets === n ? 'white' : 'text.muted'}
                                    border='1px solid'
                                    borderColor={numberOfSets === n ? 'accent.green' : 'border.subtle'}
                                    _hover={{ borderColor: 'accent.green' }}
                                    onClick={() => setNumberOfSets(n)}
                                >
                                    {n} shows
                                </Box>
                            ))}
                        </Box>

                        <Stack spacing={3} mb={5}>
                            <Box>
                                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                                    Songs to Include
                                </Text>
                                <Box display='flex' gap={2}>
                                    {([
                                        { value: false, label: 'Average Setlist' },
                                        { value: true, label: 'All Songs' },
                                    ] as const).map((option) => (
                                        <Box
                                            key={String(option.value)}
                                            as='button'
                                            flex='1'
                                            py={2.5}
                                            borderRadius='xl'
                                            fontWeight='bold'
                                            fontSize='sm'
                                            textAlign='center'
                                            cursor='pointer'
                                            transition='all 0.15s ease'
                                            bg={allSongs === option.value ? 'accent.green' : 'bg.page'}
                                            color={allSongs === option.value ? 'white' : 'text.muted'}
                                            border='1px solid'
                                            borderColor={allSongs === option.value ? 'accent.green' : 'border.subtle'}
                                            _hover={{ borderColor: 'accent.green' }}
                                            onClick={() => setAllSongs(option.value)}
                                        >
                                            {option.label}
                                        </Box>
                                    ))}
                                </Box>
                                <Text fontSize='xs' color='text.muted' mt={2}>
                                    {allSongs
                                        ? 'Every unique song played across the selected shows will be included.'
                                        : 'Only songs that appeared frequently enough to be on a typical setlist will be included.'
                                    }
                                </Text>
                            </Box>

                            <Box
                                bg='bg.page'
                                borderRadius='xl'
                                border='1px solid'
                                borderColor='border.subtle'
                                p={4}
                            >
                                <Box display='flex' justifyContent='space-between' alignItems='center'>
                                    <Box>
                                        <Text fontSize='sm' color='text.primary' fontWeight='medium'>
                                            Include Songs on Tape
                                        </Text>
                                        <Text fontSize='xs' color='text.muted' mt={0.5}>
                                            Some artists play pre-recorded backing tracks or interludes between songs. Toggle off to exclude these from your playlist.
                                        </Text>
                                    </Box>
                                    <Switch colorScheme='brand' defaultChecked size='md' ml={4} flexShrink={0} />
                                </Box>
                            </Box>
                        </Stack>

                        <Box bg='bg.page' borderRadius='xl' border='1px solid' borderColor='border.subtle' p={4} mb={5}>
                            <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={2}>
                                How song order works
                            </Text>
                            <Text fontSize='xs' color='text.muted' lineHeight='tall'>
                                Songs are ranked by how frequently they appear across the selected shows. The playlist is then ordered by each song's average position in the setlist — so openers stay at the top and encores land at the end, just like a real show.
                            </Text>
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
