import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChooseArtist } from '../pages/ChooseArtist'
import { StepProvider } from '../..//src/context/StepContext'

test('ChooseArtist component renders header', () => {
    render(
        <StepProvider>
            <ChooseArtist />
        </StepProvider>
    )

    const header = screen.queryByText(/Choose Your Artist.../i)
    expect(header).toBeTruthy()
})
