import { Button, FormControl, Box, Text, Image, Divider, Switch, Stack, Select } from "@chakra-ui/react";
import { keyframes as emotionKeyframes } from '@emotion/react';
import { BinarySpinner } from "../components/BinarySpinner";
import { useState, useEffect, useRef } from "react";

const pulse = emotionKeyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
`;
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
    beginYear: number | null;
    endYear: number | null;
};

type SearchMode = 'recent' | 'tour' | 'year';

function formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildYearOptions(beginYear?: number | null, endYear?: number | null): number[] {
    const currentYear = new Date().getFullYear();
    const end = currentYear;
    const start = beginYear ?? 1960;
    const years: number[] = [];
    for (let y = Math.min(end, endYear ?? end); y >= start; y--) {
        years.push(y);
    }
    return years;
}

export function SetSetlistMetadata() {
    const { chosenArtist, setChosenArtist, setSetlistMetadata, setlistMetadata, token } = useListenerContext();
    const setStep = useSetStep();
    const navigate = useNavigate();
    useEffect(() => { setStep(1); }, [setStep]);

    useEffect(() => {
        if (!chosenArtist) navigate('/', { replace: true });
    }, [chosenArtist, navigate]);
    const [setlistLoaded, setSetlistLoaded] = useState(false);
    const [setlistLoading, setSetlistLoading] = useState(false);

    const [searchMode, setSearchMode] = useState<SearchMode>('recent');
    const [numberOfSets, setNumberOfSets] = useState(10);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
    const [allSongs, setAllSongs] = useState(false);
    const [includeTape, setIncludeTape] = useState(true);
    const [breakupMedleys, setBreakupMedleys] = useState(false);

    const lastFetched = useRef<{ mode: SearchMode; numberOfSets: number; selectedYear: number; allSongs: boolean } | null>(null);

    const isDirty = !lastFetched.current
        || lastFetched.current.mode !== searchMode
        || lastFetched.current.allSongs !== allSongs
        || (searchMode === 'recent' && lastFetched.current.numberOfSets !== numberOfSets)
        || (searchMode === 'year' && lastFetched.current.selectedYear !== selectedYear);

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
        setSetlistLoading(true);
        try {
            const params = new URLSearchParams({
                artistMBID: chosenArtist.mbid,
                allSongs: String(allSongs),
                mode: searchMode,
            });

            if (searchMode === 'recent') {
                params.set('numberOfSets', String(numberOfSets));
            } else if (searchMode === 'tour' && showMeta?.currentTour) {
                params.set('tourName', showMeta.currentTour);
            } else if (searchMode === 'year') {
                params.set('year', String(selectedYear));
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/setlists?${params}`
            );
            const jsonData = await response.json();
            setSetlistMetadata(jsonData);
            setSetlistLoaded(true);
            lastFetched.current = { mode: searchMode, numberOfSets, selectedYear, allSongs };
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setSetlistLoading(false);
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
                            ...(token ? { 'api-key': token } : {}),
                        },
                    }
                );
                const imageUrl = await response.text();
                setArtistImage(typeof imageUrl === 'string' ? imageUrl : "");
                if (imageUrl && typeof imageUrl === 'string') {
                    setChosenArtist(prev => prev ? { ...prev, imageUrl } : prev);
                }
            } catch (error) {
                setArtistImage("");
            } finally {
                setImageLoading(false);
            }
        }
        fetchArtistImage();
    }, [chosenArtist?.artistName, token]);

    if (imageLoading) {
        return <BinarySpinner size='md' fullScreen />;
    }

    const tourAvailable = !!showMeta?.currentTour;

    const modeOptions: { value: SearchMode; label: string }[] = [
        { value: 'recent', label: 'Recent' },
        ...(tourAvailable ? [{ value: 'tour' as SearchMode, label: 'Tour' }] : []),
        { value: 'year', label: 'Memory' },
    ];

    const artistName = chosenArtist?.artistName ?? 'this artist';

    const buildPlaylistDescription = (): string => {
        switch (searchMode) {
            case 'recent': {
                const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
                return `What ${artistName} has been throwing down lately, built from their last ${numberOfSets} shows as of ${today}. Hit play and pretend you're in the front row`;
            }
            case 'tour':
                return `Every banger from ${showMeta?.currentTour}. This is what ${artistName} is playing right now, your cheat sheet before the show`;
            case 'year':
                return `${artistName} in ${selectedYear}. A time capsule of what they were playing back then`;
        }
    };

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

                <Box>
                    <FormControl mb={5}>
                        <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                            Search Mode
                        </Text>
                        <Box display='flex' gap={2} mb={2}>
                            {modeOptions.map((opt) => (
                                <Box
                                    key={opt.value}
                                    as='button'
                                    flex='1'
                                    py={2.5}
                                    borderRadius='xl'
                                    fontWeight='bold'
                                    fontSize='sm'
                                    textAlign='center'
                                    cursor='pointer'
                                    transition='all 0.15s ease'
                                    bg={searchMode === opt.value ? 'accent.green' : 'bg.page'}
                                    color={searchMode === opt.value ? 'white' : 'text.muted'}
                                    border='1px solid'
                                    borderColor={searchMode === opt.value ? 'accent.green' : 'border.subtle'}
                                    _hover={{ borderColor: 'accent.green' }}
                                    onClick={() => setSearchMode(opt.value)}
                                >
                                    {opt.label}
                                </Box>
                            ))}
                        </Box>
                        <Box display='flex' alignItems='flex-start' gap={2} mb={5}>
                            <Box
                                flexShrink={0}
                                boxSize='16px'
                                borderRadius='full'
                                border='1px solid'
                                borderColor='text.muted'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                mt='1px'
                            >
                                <Text fontSize='10px' fontWeight='bold' color='text.muted' lineHeight='1'>
                                    i
                                </Text>
                            </Box>
                            <Text fontSize='xs' color='text.muted' lineHeight='tall' >
                                {searchMode === 'recent'
                                    ? 'Builds a setlist from the most recent shows. Great for seeing what the band is playing right now.'
                                    : searchMode === 'tour'
                                        ? `Pulls every show from the ${showMeta?.currentTour} tour and finds the songs they keep coming back to.`
                                        : 'Pick a year and travel back in time. See what the setlist looked like during a specific era.'
                                }
                            </Text>
                        </Box>

                        {searchMode === 'recent' && (
                            <>
                                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                                    How Many Shows?
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
                            </>
                        )}

                        {searchMode === 'tour' && showMeta?.currentTour && (
                            <Box bg='bg.page' borderRadius='xl' border='1px solid' borderColor='border.subtle' p={4} mb={5}>
                                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={1}>
                                    Current Tour
                                </Text>
                                <Text fontSize='sm' color='accent.green' fontWeight='bold'>
                                    {showMeta.currentTour}
                                </Text>
                                <Text fontSize='xs' color='text.muted' mt={1}>
                                    All shows from this tour will be analyzed.
                                </Text>
                            </Box>
                        )}

                        {searchMode === 'year' && (
                            <>
                                <Text fontSize='xs' fontWeight='semibold' color='text.muted' textTransform='uppercase' letterSpacing='wide' mb={3}>
                                    Year
                                </Text>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    mb={5}
                                    bg='bg.page'
                                    border='1px solid'
                                    borderColor='border.subtle'
                                    borderRadius='xl'
                                    color='text.primary'
                                    _hover={{ borderColor: 'accent.green' }}
                                    size='md'
                                >
                                    {buildYearOptions(showMeta?.beginYear, showMeta?.endYear).map((y) => (
                                        <option key={y} value={y} style={{ background: '#1a1a2e' }}>
                                            {y}
                                        </option>
                                    ))}
                                </Select>
                            </>
                        )}

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
                                <Text fontSize='xs' color='text.muted' mt={2} >
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
                                            Include Interludes and Covers
                                        </Text>
                                        <Text fontSize='xs' color='text.muted' mt={0.5} >
                                            Some artists play pre-recorded tracks between songs or perform songs by other artists. Toggle off to keep only original material.
                                        </Text>
                                    </Box>
                                    <Switch colorScheme='brand' isChecked={includeTape} onChange={(e) => setIncludeTape(e.target.checked)} size='md' ml={4} flexShrink={0} />
                                </Box>
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
                                            Break Up Medleys
                                        </Text>
                                        <Text fontSize='xs' color='text.muted' mt={0.5} >
                                            Some setlists group multiple songs into a single medley. Toggle on to split them into individual tracks for your playlist.
                                        </Text>
                                    </Box>
                                    <Switch colorScheme='brand' isChecked={breakupMedleys} onChange={(e) => setBreakupMedleys(e.target.checked)} size='md' ml={4} flexShrink={0} />
                                </Box>
                            </Box>
                        </Stack>

                        <Box display='flex' alignItems='flex-start' gap={2} mb={5}>
                            <Box
                                flexShrink={0}
                                boxSize='16px'
                                borderRadius='full'
                                border='1px solid'
                                borderColor='text.muted'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                mt='1px'
                            >
                                <Text fontSize='10px' fontWeight='bold' color='text.muted' lineHeight='1'>
                                    i
                                </Text>
                            </Box>
                            <Text fontSize='xs' color='text.muted' lineHeight='tall' >
                                Songs are ranked by how frequently they appear across the selected shows. The playlist is ordered by each song's average position in the setlist, so openers stay at the top and encores land at the end, just like a real show.
                            </Text>
                        </Box>

                        {(!setlistLoaded || isDirty || setlistLoading) && (
                            <Button
                                colorScheme='spotify'
                                size={setlistLoaded ? 'md' : 'lg'}
                                w='100%'
                                borderRadius='full'
                                fontWeight='bold'
                                onClick={fetchData}
                                disabled={!chosenArtist || setlistLoading}
                                variant={setlistLoaded ? 'outline' : 'solid'}
                                css={setlistLoaded && isDirty && !setlistLoading ? { animation: `${pulse} 2s ease-in-out infinite` } : undefined}
                            >
                                {setlistLoading ? 'Loading...' : setlistLoaded ? 'Refresh Setlist' : 'Preview Setlist'}
                            </Button>
                        )}
                    </FormControl>
                </Box>

                {setlistLoading && !setlistLoaded && (
                    <Box mt={6}>
                        <BinarySpinner size='md' />
                    </Box>
                )}

                {setlistLoaded && (
                    <Box mt={2} pt={4} borderTop='1px solid' borderColor='border.subtle'>
                        <ProjectedSetlist
                            includeTape={includeTape}
                            breakupMedleys={breakupMedleys}
                            playlistDescription={buildPlaylistDescription()}
                            showSimilarity={!allSongs}
                            showCountLabel={
                                setlistMetadata?.showCount
                                    ? searchMode === 'year'
                                        ? `Compiled from ${setlistMetadata.showCount} known ${setlistMetadata.showCount === 1 ? 'show' : 'shows'} ${artistName} played in ${selectedYear}`
                                        : searchMode === 'tour'
                                            ? `Compiled from ${setlistMetadata.showCount} known ${setlistMetadata.showCount === 1 ? 'show' : 'shows'} on ${showMeta?.currentTour}`
                                            : `Compiled from the last ${setlistMetadata.showCount} ${setlistMetadata.showCount === 1 ? 'show' : 'shows'}`
                                    : null
                            }
                        />
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
