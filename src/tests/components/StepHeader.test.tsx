import { render, screen } from '@testing-library/react'
import { StepHeader } from '../../components/StepHeader'

test('renders step titles', () => {
    render(<StepHeader />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
})
