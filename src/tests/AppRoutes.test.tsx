import { render, screen } from '@testing-library/react'
import { ChooseArtist } from '../pages/ChooseArtist'
import { StepProvider } from '../context/StepContext'
import { ChakraProvider } from '@chakra-ui/react'

test('ChooseArtist component renders header', () => {
    render(
        <ChakraProvider>
            <StepProvider>
                <ChooseArtist />
            </StepProvider>
        </ChakraProvider>
    )

    const header = screen.queryByText(/Choose Your Artist/i)
    expect(header).toBeTruthy()
})
