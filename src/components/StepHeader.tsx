import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Button, HStack } from "@chakra-ui/react"
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
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
            <HStack spacing={4} mt={4}>
                <Button onClick={onPrev} isDisabled={activeStep <= 0}>Previous</Button>
                <Button onClick={onNext} colorScheme='blue' isDisabled={activeStep >= steps.length - 1}>Next</Button>
            </HStack>
        </>
    )
}