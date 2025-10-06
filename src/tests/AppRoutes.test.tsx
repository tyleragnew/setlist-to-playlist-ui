import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

test('root route renders ChooseArtist page and no unmatched route error', () => {
    // App already renders a BrowserRouter; set location before rendering to avoid nested routers
    window.history.pushState({}, 'Test page', '/')
    render(<App />)

    // ChooseArtist shows the header 'Choose Your Artist...'
    const header = screen.queryByText(/Choose Your Artist.../i)
    expect(header).toBeTruthy()
})
