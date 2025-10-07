import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Button, Stack, HStack, Circle, Text } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { useStep, useSetStep } from '../context/StepContext'

const steps = [
    { title: 'Artist', description: 'Choose An Artist', path: '/' },
    { title: 'Setlist', description: 'Set Setlist Metadata', path: '/setlistMetadata' },
    { title: 'Playlist', description: 'Create Playlist', path: '/playlist' },
]

export function StepHeader() {

    const activeStep = useStep()
    const setStep = useSetStep()
    const navigate = useNavigate()

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
            {/* mobile: compact, non-scrolling header */}
            <Box px={3} py={2} display={{ base: 'flex', md: 'none' }} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                <Text fontSize='xs' color='gray.500'>{`Step ${activeStep + 1} of ${steps.length}`}</Text>
                <Text fontSize='md' fontWeight='semibold' mt={1}>{steps[activeStep].title}</Text>
                <HStack spacing={2} mt={2}>
                    {steps.map((_, i) => (
                        <Circle key={i} size='8px' bg={i === activeStep ? 'blue.500' : 'gray.300'} />
                    ))}
                </HStack>
            </Box>

            {/* desktop: full stepper */}
            <Box px={{ base: 0, md: 0 }} display={{ base: 'none', md: 'block' }}>
                <Box maxW='960px' mx='auto' px={4}>
                    <Stepper index={activeStep}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>
                                <Box flexShrink='0'>
                                    <Box as={StepTitle}>{step.title}</Box>
                                    <Box as={StepDescription}>{step.description}</Box>
                                </Box>
                                <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* fixed bottom controls: stack vertically on mobile, horizontally on larger screens */}
            <Box as="footer" position="fixed" bottom={0} left={0} right={0} display="flex" justifyContent="center" zIndex={9999} px={{ base: 3, md: 0 }} pointerEvents='auto' bg='transparent'>
                <Box width={{ base: '100%', md: 'auto' }} maxW='720px' boxSizing='border-box' py={3}>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="center">
                        <Button onClick={onPrev} isDisabled={activeStep <= 0} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }}>
                            Previous
                        </Button>
                        <Button onClick={onNext} colorScheme='blue' isDisabled={activeStep >= steps.length - 1} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }}>
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}