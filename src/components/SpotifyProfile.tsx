import { Box, Text } from '@chakra-ui/react';

export interface SpotifyProfileProps {
    image?: string;
    displayName: string;
}

export function SpotifyProfile({ image, displayName }: SpotifyProfileProps) {
    return (
        <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            w='100%'
            py={3}
            position='relative'
        >
            {/* Desktop: centered title */}
            <Box display={{ base: 'none', md: 'flex' }} position='absolute' left='50%' transform='translateX(-50%)'>
                <Text
                    fontSize='2xl'
                    fontWeight='bold'
                    color='accent.green'
                    letterSpacing='tight'
                    fontFamily="'Inter', system-ui, sans-serif"
                >
                    Setlist
                    <Text as='span' color='text.primary'>2</Text>
                    Playlist
                </Text>
            </Box>

            {/* Mobile: left-aligned title */}
            <Text
                display={{ base: 'block', md: 'none' }}
                fontSize='xl'
                fontWeight='bold'
                color='accent.green'
                letterSpacing='tight'
                fontFamily="'Inter', system-ui, sans-serif"
            >
                Setlist
                <Text as='span' color='text.primary'>2</Text>
                Playlist
            </Text>

            <Box ml='auto'
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
                        boxSize={{ base: '28px', md: '32px' }}
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
    );
}
