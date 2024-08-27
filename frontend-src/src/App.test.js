import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { getCurrentTrack, selectStatus, selectCurrentTrack, selectIsPlaying } from './features/player/playerSlice';
import App from './App';
import { AppBody } from './App';
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
// import { getUser, signTos, selectUser } from './features/user/userSlice';

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

// jest.mock('./features/user/userSlice', () => ({
//   selectUser: jest.fn(),
//   signTos: jest.fn()
// }));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  useMantineColorScheme: jest.fn()
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
    useMantineColorScheme.mockReturnValue({
      colorScheme: 'light',
      toggleColorScheme: jest.fn(),
      setColorScheme: jest.fn()
    });

    window.spotifyUser = {};
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(getByText(/login with spotify/i)).toBeInTheDocument();
  });

  test('renders error boundary when player current track status is rejected', () => {
    useMantineColorScheme.mockReturnValue({
      colorScheme: 'light',
      toggleColorScheme: jest.fn(),
      setColorScheme: jest.fn()
    });

    selectStatus
      .mockReturnValue('rejected');
    selectCurrentTrack
      .mockReturnValue({});
    selectIsPlaying
      .mockReturnValue(false);
    getCurrentTrack
      .mockReturnValue({ type: 'player/getCurrentTrack' });


    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('renders the page when user is logged in', () => {
    useMantineColorScheme.mockReturnValue({
      colorScheme: 'light',
      toggleColorScheme: jest.fn(),
      setColorScheme: jest.fn()
    });

    selectStatus
      .mockReturnValue('fulfilled');
    selectCurrentTrack
      .mockReturnValue({});
    selectIsPlaying
      .mockReturnValue(false);
    getCurrentTrack
      .mockReturnValue({ type: 'player/getCurrentTrack' });


    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/David Coldplay/i)).toBeInTheDocument();
    expect(getByText(/Add \/ Remove currently playing/i)).toBeInTheDocument();
    expect(getByText(/©/i)).toBeInTheDocument();
  });

  // test('renders the TOS page when user.tos_signed is N', () => {
  //   useMantineColorScheme.mockReturnValue({
  //     colorScheme: 'light',
  //     toggleColorScheme: jest.fn(),
  //     setColorScheme: jest.fn()
  //   });

  //   jest.mock('./features/user/userSlice', () => ({
  //     selectUser: jest.fn().mockReturnValue({ theme: 'dark', tos_signed: 'N' })
  //   }));
  //   // selectUser.mockReturnValue({ theme: 'dark', tos_signed: 'N' });
  //   selectStatus
  //     .mockReturnValue('fulfilled');
  //   selectCurrentTrack
  //     .mockReturnValue({});
  //   selectIsPlaying
  //     .mockReturnValue(false);
  //   getCurrentTrack
  //     .mockReturnValue({ type: 'player/getCurrentTrack' });


  //   const { getByText } = render(
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   );
  //   expect(getByText(/You must be at least 13 years old/i)).toBeInTheDocument();
  //   // const button = screen.getByRole('button', { name: 'Agree to TOS' });
  //   // button.click();
  //   // expect(signTos).toHaveBeenCalled();
  // });

  test('sets the user theme when user is loaded', () => {

    useMantineColorScheme.mockReturnValue({
      colorScheme: 'light',
      toggleColorScheme: jest.fn(),
      setColorScheme: jest.fn()
    });

    render(
      <Provider store={store}>
        <MantineProvider>
          <AppBody><div>pizza</div></AppBody>
        </MantineProvider>
      </Provider>
    );

    const { setColorScheme } = useMantineColorScheme();
    expect(setColorScheme).toHaveBeenCalledTimes(1);
  });


});
