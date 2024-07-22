import React from 'react';
import { render } from '@testing-library/react';
import Nav from './Nav';


test('renders logged in when display name is present', () => {
    const user = {
        display_name: "Pizza",
        images: [
            { url: 'http://image' }
        ]
    }
    const { getByText } = render(
        <Nav spotifyUser={user} />
    );

    expect(getByText(/Pizza/i)).toBeInTheDocument();
});

test('renders logged out when display name is not present', () => {
    const { getByText } = render(
        <Nav spotifyUser={{}} />
    );

    expect(getByText(/Login/i)).toBeInTheDocument();
});
