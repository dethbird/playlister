import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

test('renders login screen when spotify user is not set', () => {
  window.spotifyUser = {
    display_name: "Pizza",
    images: [
      { url: 'http://image' }
    ]
  };
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/Pizza/i)).toBeInTheDocument();
});
