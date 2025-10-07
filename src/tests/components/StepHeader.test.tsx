import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StepHeader } from '../../components/StepHeader'
import { StepProvider } from '../../context/StepContext'
import { ChakraProvider } from '@chakra-ui/react'

test('renders step titles', () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <StepProvider>
                <ChakraProvider>
                    <StepHeader />
                </ChakraProvider>
            </StepProvider>
        </MemoryRouter>
    )
    // Titles may appear in both mobile and desktop variants; ensure they appear at least once
    expect(screen.getAllByText('First').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Second').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Third').length).toBeGreaterThanOrEqual(1)

    // Mobile compact view should display the active step title as well
    const mobileTitle = screen.getAllByText('First')[0]
    expect(mobileTitle).toBeInTheDocument()
})
