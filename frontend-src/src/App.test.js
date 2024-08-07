import React from 'react';
import { render } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { getCurrentTrack, selectStatus, selectCurrentTrack, selectIsPlaying } from './features/player/playerSlice';
import App from './App';

let matchMedia;
const spotifyUser = {
  id: '1267654234',
  display_name: 'David Coldplay',
  images: [
    { url: 'https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d' }
  ]
}

jest.mock('./features/player/playerSlice', () => ({
  selectStatus: jest.fn(),
  selectCurrentTrack: jest.fn(),
  selectIsPlaying: jest.fn(),
  getCurrentTrack: jest.fn()
}));


describe('App', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
    window.spotifyUser = spotifyUser;
  });

  afterEach(() => {
    matchMedia.clear();
    window.spotifyUser = spotifyUser;
  });

  test('renders login screen when spotify user is not set', () => {
    window.spotifyUser = {};
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(getByText(/login with spotify/i)).toBeInTheDocument();
  });

  test('renders error boundary when player current track status is rejected', () => {
    const state = {
      player: {
        status: 'rejected'
      }
    };
    selectStatus
      .mockReturnValue('rejected');
    selectCurrentTrack
      .mockReturnValue(cb => { });
    selectIsPlaying
      .mockReturnValue(cb => false);
    getCurrentTrack
      .mockReturnValue({type: 'player/getCurrentTrack'});


    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('renders the page when user is logged in', () => {
    const state = {
      player: {
        status: 'rejected'
      }
    };
    selectStatus
      .mockReturnValue('fulfilled');
    selectCurrentTrack
      .mockReturnValue(cb => { });
    selectIsPlaying
      .mockReturnValue(cb => false);
    getCurrentTrack
      .mockReturnValue({type: 'player/getCurrentTrack'});


    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/David Coldplay/i)).toBeInTheDocument();
    expect(getByText(/Add \/ Remove currently playing/i)).toBeInTheDocument();
    expect(getByText(/©/i)).toBeInTheDocument();
  });

});

