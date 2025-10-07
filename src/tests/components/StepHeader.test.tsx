import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StepHeader } from '../../components/StepHeader'
import { StepProvider } from '../../context/StepContext'

test('renders step titles', () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <StepProvider>
                <StepHeader />
            </StepProvider>
        </MemoryRouter>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
})
