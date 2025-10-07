import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChooseArtist } from '../pages/ChooseArtist'

test('ChooseArtist component renders header', () => {
    render(<ChooseArtist />)

    const header = screen.queryByText(/Choose Your Artist.../i)
    expect(header).toBeTruthy()
})
