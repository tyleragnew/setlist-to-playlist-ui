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
                mb={1}
                bg='bg.surface'
            >
                <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    bg='bg.overlay'
                    px={3}
                    py={1.5}
                    borderRadius='full'
                    border='1.5px solid'
                    borderColor='accent.green'
                    boxShadow='0 2px 12px rgba(29,185,84,0.15)'
                >
                    {image && (
                        <Box
                            boxSize='32px'
                            borderRadius='full'
                            overflow='hidden'
                            border='2px solid'
                            borderColor='accent.green'
                            mr={2}
                            flexShrink={0}
                        >
                            <img
                                src={image}
                                alt='Spotify profile'
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </Box>
                    )}
                    <Text fontWeight='semibold' fontSize='sm' color='text.primary' mr={1.5}>
                        {displayName}
                    </Text>
                    <Text fontSize='xs' color='accent.green' fontWeight='medium'>
                        ●
                    </Text>
                </Box>
            </Box>

            {/* Desktop: fixed top right */}
            <Box
                position='fixed'
                top={5}
                right={6}
                zIndex={200}
                display={{ base: 'none', md: 'flex' }}
                alignItems='center'
                bg='bg.overlay'
                px={3}
                py={2}
                borderRadius='full'
                border='1.5px solid'
                borderColor='accent.green'
                boxShadow='0 2px 16px rgba(29,185,84,0.18)'
                backdropFilter='blur(12px)'
            >
                {image && (
                    <Box
                        boxSize='36px'
                        borderRadius='full'
                        overflow='hidden'
                        border='2px solid'
                        borderColor='accent.green'
                        mr={2}
                        flexShrink={0}
                    >
                        <img
                            src={image}
                            alt='Spotify profile'
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </Box>
                )}
                <Text fontWeight='semibold' fontSize='sm' color='text.primary' mr={2}>
                    {displayName}
                </Text>
                <Text fontSize='xs' color='accent.green' fontWeight='bold'>
                    ●
                </Text>
            </Box>
        </>
    );
}
