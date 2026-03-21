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
    HStack,
    Circle,
    Text
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'
import { useStep, useSetStep } from '../context/StepContext'
import { useAuth } from '../hooks/useAuth'
import { ColorModeToggle } from './ColorModeToggle'

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
        if (idx < 0 || idx >= activeStep) return
        setStep(idx)
        navigate(steps[idx].path)
    }

    return (
        <>
            {/* mobile: compact header */}
            <Box
                px={3}
                py={2}
                h='72px'
                display={{ base: 'flex', md: 'none' }}
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                bg='bg.surface'
                borderBottom='1px solid'
                borderColor='border.subtle'
            >
                <HStack w='100%' justify='space-between' align='center' mb={1}>
                    <Box
                        w='32px'
                        as='button'
                        onClick={() => goTo(activeStep - 1)}
                        visibility={activeStep > 0 ? 'visible' : 'hidden'}
                        color='text.muted'
                        _hover={{ color: 'accent.green' }}
                        transition='color 0.15s ease'
                        aria-label='Go back'
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </Box>
                    <Box textAlign='center' flex='1'>
                        <Text fontSize='xs' color='accent.green' fontWeight='semibold' letterSpacing='wide' textTransform='uppercase'>
                            {`Step ${activeStep + 1} of ${steps.length}`}
                        </Text>
                        <Text fontSize='md' fontWeight='bold' color='text.primary'>{steps[activeStep].title}</Text>
                    </Box>
                    <ColorModeToggle />
                </HStack>
                <HStack spacing={2} mt={1}>
                    {steps.map((_, i) => (
                        <Circle
                            key={i}
                            size='8px'
                            bg={i === activeStep ? 'accent.green' : 'border.subtle'}
                            transition='background-color 0.2s ease'
                        />
                    ))}
                </HStack>
            </Box>

            {/* desktop: full stepper */}
            <Box
                display={{ base: 'none', md: 'block' }}
                bg='bg.surface'
                borderBottom='1px solid'
                borderColor='border.subtle'
                pt={isAuthenticated && profile ? 0 : 4}
                pb={4}
            >
                <Box maxW='960px' mx='auto' px={4} position='relative'>
                    <Stepper index={activeStep} colorScheme='brand' size='lg' gap={8}>
                        {steps.map((step, index) => (
                            <Step
                                key={index}
                                onClick={() => index < activeStep && goTo(index)}
                                cursor={index < activeStep ? 'pointer' : 'default'}
                                _hover={index < activeStep ? { opacity: 0.8 } : {}}
                                transition='opacity 0.15s ease'
                            >
                                <StepIndicator boxSize='44px'>
                                    <StepStatus
                                        complete={<StepIcon boxSize='24px' />}
                                        incomplete={
                                            <Box as='span' fontSize='xl' color='text.muted'>
                                                <StepNumber />
                                            </Box>
                                        }
                                        active={
                                            <Box as='span' fontSize='xl' color='accent.green' fontWeight='bold'>
                                                <StepNumber />
                                            </Box>
                                        }
                                    />
                                </StepIndicator>
                                <Box flexShrink='0' ml={2} mr={2}>
                                    <Box
                                        as={StepTitle}
                                        color='text.primary'
                                        fontSize='xl'
                                        fontWeight='bold'
                                    >
                                        {step.title}
                                    </Box>
                                    <Box
                                        as={StepDescription}
                                        color='text.muted'
                                        fontSize='sm'
                                    >
                                        {step.description}
                                    </Box>
                                </Box>
                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* desktop: fixed bottom-right toggle */}
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
