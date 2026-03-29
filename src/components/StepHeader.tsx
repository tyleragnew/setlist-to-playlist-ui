import { Box, HStack, Text } from "@chakra-ui/react";
import { keyframes as emotionKeyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom'
import { useStep, useSetStep } from '../context/StepContext'
import { useAuth } from '../hooks/useAuth'
import { ColorModeToggle } from './ColorModeToggle'

const shimmer = emotionKeyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const pulseGlow = emotionKeyframes`
    0%, 100% { box-shadow: 0 0 8px rgba(29,185,84,0.3), 0 0 20px rgba(29,185,84,0.1); }
    50% { box-shadow: 0 0 12px rgba(29,185,84,0.5), 0 0 30px rgba(29,185,84,0.15); }
`;

const steps = [
    { title: 'Artist', icon: 'M12 14.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 14.5c-4.42 0-8 1.79-8 4v1.5h16v-1.5c0-2.21-3.58-4-8-4z', path: '/' },
    { title: 'Setlist', icon: 'M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z', path: '/setlistMetadata' },
    { title: 'Playlist', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 15l2 2 4-4', path: '/playlist' },
]

export function StepHeader() {
    const activeStep = useStep()
    const setStep = useSetStep()
    const navigate = useNavigate()
    const { isAuthenticated, profile } = useAuth()

    const goTo = (idx: number) => {
        if (idx < 0 || idx >= activeStep) return
        setStep(idx)
        navigate(steps[idx].path)
    }

    return (
        <>
            {/* Mobile */}
            <Box
                display={{ base: 'block', md: 'none' }}
                px={2}
                pt={2}
                pb={4}
            >
                <HStack justify='space-between' align='center' mb={3}>
                    <Box
                        as='button'
                        onClick={() => goTo(activeStep - 1)}
                        visibility={activeStep > 0 ? 'visible' : 'hidden'}
                        color='text.muted'
                        _hover={{ color: 'accent.green' }}
                        transition='color 0.15s ease'
                        aria-label='Go back'
                        p={1}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </Box>
                    <HStack spacing={0}>
                        {steps.map((step, i) => {
                            const isActive = i === activeStep;
                            const isComplete = i < activeStep;
                            const isFuture = i > activeStep;
                            return (
                                <HStack key={i} spacing={0}>
                                    <Box
                                        as='button'
                                        display='flex'
                                        alignItems='center'
                                        gap={1.5}
                                        px={isActive ? 3 : 2}
                                        py={1.5}
                                        borderRadius='full'
                                        bg={isActive ? 'accent.green' : 'transparent'}
                                        cursor={isComplete ? 'pointer' : 'default'}
                                        onClick={() => isComplete && goTo(i)}
                                        transition='all 0.3s ease'
                                        opacity={isFuture ? 0.35 : 1}
                                        css={isActive ? { animation: `${pulseGlow} 3s ease-in-out infinite` } : undefined}
                                    >
                                        <Box boxSize='16px' flexShrink={0}>
                                            {isComplete ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--chakra-colors-accent-green)' }}>
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? 'white' : 'var(--chakra-colors-text-muted)' }}>
                                                    <path d={step.icon} />
                                                </svg>
                                            )}
                                        </Box>
                                        {isActive && (
                                            <Text fontSize='xs' fontWeight='bold' color='white' letterSpacing='wide'>
                                                {step.title}
                                            </Text>
                                        )}
                                    </Box>
                                    {i < steps.length - 1 && (
                                        <Box
                                            w='16px'
                                            h='1px'
                                            bg={i < activeStep ? 'accent.green' : 'border.subtle'}
                                            transition='background-color 0.3s ease'
                                        />
                                    )}
                                </HStack>
                            );
                        })}
                    </HStack>
                    <ColorModeToggle />
                </HStack>
            </Box>

            {/* Desktop */}
            <Box
                display={{ base: 'none', md: 'block' }}
                pt={isAuthenticated && profile ? 0 : 4}
                pb={5}
            >
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    mx='auto'
                    bg='bg.card'
                    border='1px solid'
                    borderColor='border.subtle'
                    borderRadius='2xl'
                    px={3}
                    py={2.5}
                    boxShadow='0 4px 24px rgba(0,0,0,0.06)'
                    backdropFilter='blur(12px)'
                    maxW='fit-content'
                >
                    <HStack spacing={0}>
                        {steps.map((step, i) => {
                            const isActive = i === activeStep;
                            const isComplete = i < activeStep;
                            const isFuture = i > activeStep;

                            return (
                                <HStack key={i} spacing={0}>
                                    <Box
                                        as='button'
                                        display='flex'
                                        alignItems='center'
                                        gap={2.5}
                                        px={5}
                                        py={2.5}
                                        borderRadius='xl'
                                        cursor={isComplete ? 'pointer' : 'default'}
                                        onClick={() => isComplete && goTo(i)}
                                        transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        position='relative'
                                        overflow='hidden'
                                        bg={isActive ? 'accent.green' : 'transparent'}
                                        _hover={isComplete ? { bg: 'border.subtle' } : {}}
                                        opacity={isFuture ? 0.4 : 1}
                                        css={isActive ? { animation: `${pulseGlow} 3s ease-in-out infinite` } : undefined}
                                    >
                                        {isActive && (
                                            <Box
                                                position='absolute'
                                                inset={0}
                                                bgGradient='linear(to-r, transparent, rgba(255,255,255,0.1), transparent)'
                                                bgSize='200% 100%'
                                                css={{ animation: `${shimmer} 3s ease-in-out infinite` }}
                                            />
                                        )}
                                        <Box
                                            boxSize='28px'
                                            borderRadius='lg'
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='center'
                                            flexShrink={0}
                                            bg={isActive ? 'rgba(255,255,255,0.2)' : isComplete ? 'accent.green' : 'bg.page'}
                                            transition='all 0.3s ease'
                                            position='relative'
                                            zIndex={1}
                                        >
                                            {isComplete ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? 'white' : 'var(--chakra-colors-text-muted)' }}>
                                                    <path d={step.icon} />
                                                </svg>
                                            )}
                                        </Box>
                                        <Text
                                            fontSize='sm'
                                            fontWeight={isActive ? 'bold' : 'medium'}
                                            color={isActive ? 'white' : isComplete ? 'text.primary' : 'text.muted'}
                                            transition='color 0.3s ease'
                                            position='relative'
                                            zIndex={1}
                                        >
                                            {step.title}
                                        </Text>
                                    </Box>
                                    {i < steps.length - 1 && (
                                        <Box display='flex' alignItems='center' px={1}>
                                            <Box
                                                w='32px'
                                                h='2px'
                                                borderRadius='full'
                                                bg={i < activeStep ? 'accent.green' : 'border.subtle'}
                                                transition='background-color 0.4s ease'
                                                position='relative'
                                                overflow='hidden'
                                            >
                                                {i < activeStep && (
                                                    <Box
                                                        position='absolute'
                                                        inset={0}
                                                        bgGradient='linear(to-r, transparent, rgba(255,255,255,0.4), transparent)'
                                                        bgSize='200% 100%'
                                                        css={{ animation: `${shimmer} 2s ease-in-out infinite` }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </HStack>
                            );
                        })}
                    </HStack>
                </Box>
            </Box>

            {/* Desktop: fixed bottom-right toggle */}
            <Box
                display={{ base: 'none', md: 'block' }}
                position='fixed'
                bottom={5}
                right={5}
                zIndex={10}
            >
                <ColorModeToggle />
            </Box>
        </>
    )
}
