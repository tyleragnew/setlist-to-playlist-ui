import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Button, Stack, HStack, Circle, Text } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { useStep, useSetStep } from '../context/StepContext'

const steps = [
    { title: 'First', description: 'Choose An Artist', path: '/' },
    { title: 'Second', description: 'Set Setlist Metadata', path: '/setlistMetadata' },
    { title: 'Third', description: 'Create Playlist', path: '/playlist' },
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
            <Box px={4} py={3} display={{ base: 'block', md: 'none' }}>
                <Text fontSize='sm' color='gray.500'>{`Step ${activeStep + 1} of ${steps.length}`}</Text>
                <Text fontSize='lg' fontWeight='semibold'>{steps[activeStep].title}</Text>
                <HStack spacing={2} mt={2}>
                    {steps.map((_, i) => (
                        <Circle key={i} size='8px' bg={i === activeStep ? 'blue.500' : 'gray.300'} />
                    ))}
                </HStack>
            </Box>

            {/* desktop: full stepper */}
            <Box px={{ base: 0, md: 0 }} display={{ base: 'none', md: 'block' }}>
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

            {/* fixed bottom controls: stack vertically on mobile, horizontally on larger screens */}
            <Box position="fixed" bottom={{ base: '8px', md: '16px' }} left={0} right={0} display="flex" justifyContent="center" zIndex={20} px={{ base: 4, md: 0 }}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={3} align="center" maxW="720px" width="100%">
                    <Button onClick={onPrev} isDisabled={activeStep <= 0} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }}>
                        Previous
                    </Button>
                    <Button onClick={onNext} colorScheme='blue' isDisabled={activeStep >= steps.length - 1} size={{ base: 'sm', md: 'md' }} w={{ base: '100%', md: 'auto' }}>
                        Next
                    </Button>
                </Stack>
            </Box>
        </>
    )
}