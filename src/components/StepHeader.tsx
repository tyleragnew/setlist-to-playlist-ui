import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Button,
    Stack,
    HStack,
    Circle,
    Text
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'
import { useStep, useSetStep } from '../context/StepContext'
import { useAuth } from '../hooks/useAuth'

const steps = [
    { title: 'Artist', description: 'Choose An Artist', path: '/' },
    { title: 'Setlist', description: 'Set Setlist Metadata', path: '/setlistMetadata' },
    { title: 'Playlist', description: 'Create Playlist', path: '/playlist' },
]

export function StepHeader() {

    const activeStep = useStep()
    const setStep = useSetStep()
    const navigate = useNavigate()
    const { isAuthenticated, profile } = useAuth()

    const goTo = (idx: number) => {
        if (idx < 0 || idx >= steps.length) return
        setStep(idx)
        const path = steps[idx].path
        navigate(path)
    }

    const onPrev = () => goTo(activeStep - 1)
    const onNext = () => goTo(activeStep + 1)

    return (
        <>
            {/* Spotify profile section */}
            {/* Profile section moved to App.tsx for global positioning */}
            {/* mobile: compact, non-scrolling header */}
            <Box px={3} py={1} display={{ base: 'flex', md: 'none' }} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' bg='spotify.black'>
                <Text fontSize='xs' color='spotify.green' mb={1}>{`Step ${activeStep + 1} of ${steps.length}`}</Text>
                <Text fontSize='md' fontWeight='semibold' color='spotify.white'>{steps[activeStep].title}</Text>
                <HStack spacing={2} mt={2}>
                    {steps.map((_, i) => (
                        <Circle key={i} size='8px' bg={i === activeStep ? 'spotify.green' : 'gray.700'} />
                    ))}
                </HStack>
            </Box>

            {/* desktop: full stepper - larger and more prominent */}
            <Box px={{ base: 0, md: 0 }} display={{ base: 'none', md: 'block' }} bg='spotify.black' pt={isAuthenticated && profile ? 0 : 4} pb={4}>
                <Box maxW='960px' mx='auto' px={4}>
                    <Stepper index={activeStep} colorScheme='spotify' size='lg' gap={8}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepIndicator boxSize='44px'>
                                    <StepStatus
                                        complete={<StepIcon color='spotify.green' boxSize='32px' />}
                                        incomplete={<Box color='spotify.white'><Text fontSize='2xl'><StepNumber /></Text></Box>}
                                        active={<Box color='spotify.green'><Text fontSize='2xl'><StepNumber /></Text></Box>}
                                    />
                                </StepIndicator>
                                <Box flexShrink='0' ml={2} mr={2}>
                                    <Box as={StepTitle} color='spotify.white' fontSize='2xl' fontWeight='bold'>{step.title}</Box>
                                    <Box as={StepDescription} color='spotify.green' fontSize='lg'>{step.description}</Box>
                                </Box>
                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* footer: always sticky at bottom, avoid overlap with content */}
            <Box
                as="footer"
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                width="100%"
                display="flex"
                justifyContent="center"
                zIndex={9999}
                px={{ base: 3, md: 0 }}
                pointerEvents='auto'
                bg='spotify.gray'
                boxShadow='0 -2px 12px rgba(0,0,0,0.12)'
            >
                <Box width={{ base: '100%', md: 'auto' }} maxW='720px' boxSizing='border-box' py={3}>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="center">
                        <Button onClick={onPrev} isDisabled={activeStep <= 0} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }} variant='outline' colorScheme='spotify'>
                            Previous
                        </Button>
                        <Button onClick={onNext} colorScheme='spotify' isDisabled={activeStep >= steps.length - 1} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }}>
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}