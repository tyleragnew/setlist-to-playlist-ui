import { Box, Text } from '@chakra-ui/react';

export interface SpotifyProfileProps {
    image?: string;
    displayName: string;
}

export function SpotifyProfile({ image, displayName }: SpotifyProfileProps) {
    return (
        <>
            {/* Mobile: above step header, centered */}
            <Box
                display={{ base: 'flex', md: 'none' }}
                justifyContent='center'
                alignItems='center'
                w='100%'
                pt={2}
                pb={1}
                mb={2}
            >
                <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    bg='rgba(40,40,40,0.85)'
                    px={3}
                    py={1}
                    borderRadius='lg'
                    boxShadow='0 2px 12px rgba(30,185,84,0.18)'
                    border='2px solid'
                    borderColor='spotify.green'
                >
                    {image && (
                        <Box
                            boxSize='40px'
                            borderRadius='full'
                            overflow='hidden'
                            border='3px solid'
                            borderColor='spotify.green'
                            bg='spotify.black'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            mr={3}
                        >
                            <img
                                src={image}
                                alt='Spotify profile'
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </Box>
                    )}
                    <Box display='flex' flexDirection='column' alignItems='flex-start'>
                        <Text fontWeight='bold' fontSize='md' color='spotify.green' mb={0} fontFamily='heading'>
                            {displayName}
                        </Text>
                        <Text fontSize='xs' color='spotify.white' opacity={0.8} fontStyle='italic' letterSpacing='wider' mb={0}>
                            Logged in
                        </Text>
                    </Box>
                </Box>
            </Box>
            {/* Desktop: fixed top right */}
            <Box
                position='fixed'
                top={6}
                right={8}
                zIndex={200}
                display={{ base: 'none', md: 'flex' }}
                alignItems='center'
                bg='rgba(40,40,40,0.85)'
                px={3}
                py={2}
                borderRadius='lg'
                boxShadow='0 2px 12px rgba(30,185,84,0.18)'
                border='2px solid'
                borderColor='spotify.green'
            >
                {image && (
                    <Box
                        boxSize='56px'
                        borderRadius='full'
                        overflow='hidden'
                        border='3px solid'
                        borderColor='spotify.green'
                        mr={3}
                        bg='spotify.black'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <img
                            src={image}
                            alt='Spotify profile'
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </Box>
                )}
                <Text fontWeight='bold' fontSize='xl' color='spotify.green' mr={2} fontFamily='heading'>
                    {displayName}
                </Text>
                <Text fontSize='sm' color='spotify.white' opacity={0.8} fontStyle='italic' letterSpacing='wider' ml={1} textShadow='0 1px 4px rgba(0,0,0,0.18)'>
                    Logged in
                </Text>
            </Box>
        </>
    );
}
