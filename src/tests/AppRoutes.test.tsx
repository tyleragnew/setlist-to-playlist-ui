import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ChooseArtist } from '../pages/ChooseArtist'
import { StepProvider } from '../context/StepContext'
import { ChakraProvider } from '@chakra-ui/react'
import ListenerContext from '../context/ListenerContext'

const mockContext = {
    chosenArtist: null,
    setChosenArtist: () => {},
    token: '',
    playlistMetadata: null,
    setPlaylistMetadata: () => {},
    setlistMetadata: null,
    setSetlistMetadata: () => {},
    setlistLoaded: false,
    setSetlistLoaded: () => {},
}

test('ChooseArtist component renders header', () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <ListenerContext.Provider value={mockContext}>
                <ChakraProvider>
                    <StepProvider>
                        <ChooseArtist />
                    </StepProvider>
                </ChakraProvider>
            </ListenerContext.Provider>
        </MemoryRouter>
    )

    const header = screen.queryByText(/Choose Your Artist/i)
    expect(header).toBeTruthy()
})
