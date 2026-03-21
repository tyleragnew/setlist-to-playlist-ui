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
        if (idx < 0 || idx >= steps.length) return
        setStep(idx)
        const path = steps[idx].path
        navigate(path)
    }

    const onPrev = () => goTo(activeStep - 1)
    const onNext = () => goTo(activeStep + 1)

    return (
        <>
            {/* mobile: compact header */}
            <Box
                px={3}
                py={2}
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
                    <Box w='32px' /> {/* spacer */}
                    <Box textAlign='center'>
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
                            <Step key={index}>
                                <StepIndicator boxSize='44px'>
                                    <StepStatus
                                        complete={<StepIcon boxSize='24px' />}
                                        incomplete={
                                            <Text fontSize='xl' color='text.muted'>
                                                <StepNumber />
                                            </Text>
                                        }
                                        active={
                                            <Text fontSize='xl' color='accent.green' fontWeight='bold'>
                                                <StepNumber />
                                            </Text>
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
                    {/* Color mode toggle top-right of stepper bar */}
                    <Box position='absolute' top='50%' right={4} transform='translateY(-50%)'>
                        <ColorModeToggle />
                    </Box>
                </Box>
            </Box>

            {/* footer: sticky nav buttons */}
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
                bg='bg.surface'
                borderTop='1px solid'
                borderColor='border.subtle'
                backdropFilter='blur(12px)'
            >
                <Box width={{ base: '100%', md: 'auto' }} maxW='720px' boxSizing='border-box' py={3}>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="center">
                        <Button
                            onClick={onPrev}
                            isDisabled={activeStep <= 0}
                            size={{ base: 'sm', md: 'md' }}
                            w={{ base: '100%', md: 'auto' }}
                            variant='outline'
                            colorScheme='spotify'
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={onNext}
                            colorScheme='spotify'
                            isDisabled={activeStep >= steps.length - 1}
                            size={{ base: 'sm', md: 'md' }}
                            w={{ base: '100%', md: 'auto' }}
                        >
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}
