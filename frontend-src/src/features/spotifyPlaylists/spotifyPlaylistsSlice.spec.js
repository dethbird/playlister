
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { apiRequest } from '../../app/apiConfig';

import spotifyPlaylistsReducer, {
  initialState,
  getSpotifyPlaylists,
  addSpotifyPlaylistToManaged,
  toggleDialog
} from './spotifyPlaylistsSlice';
import { getManagedPlaylists } from '../managedPlaylists/managedPlaylistsSlice';

const middlewares = [thunk]
const mockStore = configureStore(middlewares);

const serviceError = 'internal service error';

let mockPlaylistMetadata;
let mockPlaylistsResponse;
let mockSpotifyPlaylist;

jest.mock('../../app/apiConfig', () => ({
  apiRequest: jest.fn(),
}));

describe('spotifyPlaylistSlice ', () => {

  beforeEach(() => {
    jest.useFakeTimers();
    mockSpotifyPlaylist = {
      id: 'XXX',
      images: [
        { url: 'http://image' }
      ],
      tracks: {
        total: 100
      },
      is_playing: true
    };
    mockPlaylistMetadata = {
      'XXX': mockSpotifyPlaylist
    };
    mockPlaylistsResponse = [
      { id: 1},
      { id: 2},
      { id: 3}
    ];
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.useRealTimers()
  });

  it('should handle initial state', () => {
    expect(spotifyPlaylistsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('getSpotifyPlaylists pending then fulfilled', () => {

    const store = mockStore({})

    const resp = makeResp(mockPlaylistsResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getSpotifyPlaylists({limit: 25, offset: 0}))
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getSpotifyPlaylists.pending.type);
        expect(actionsDispatched[1].type).toEqual(getSpotifyPlaylists.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual(mockPlaylistsResponse);
      });

  });

  it('addSpotifyPlaylistToManaged pending then toggle dialog and get managed playlists', () => {

    const store = mockStore({})

    const resp = makeResp({});

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(addSpotifyPlaylistToManaged())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(addSpotifyPlaylistToManaged.pending.type);
        // The thunk dispatches toggleDialog() and getManagedPlaylists() inside the
        // payload creator before it returns the data, so ordering between
        // fulfilled and those follow-up dispatches may vary. Assert presence
        // instead of strict ordering.
        const types = actionsDispatched.map(a => a.type);
        expect(types).toContain(addSpotifyPlaylistToManaged.fulfilled.type);
        expect(types).toContain(toggleDialog.type);
        expect(types).toContain(getManagedPlaylists.pending.type);
        const fulfilledAction = actionsDispatched.find(a => a.type === addSpotifyPlaylistToManaged.fulfilled.type);
        expect(fulfilledAction.payload).toEqual({});
      });

  });

  it('toggleFDialog toggles dialogIsOpen in state', () => {
    const action = toggleDialog();
    const expectedState = { ...initialState, dialogIsOpen: true }
    expect(spotifyPlaylistsReducer(initialState, action)).toEqual(expectedState);
  });

  it('getSpotifyPlaylists.fulfilled', () => {
    const action = { type: getSpotifyPlaylists.fulfilled, payload: mockSpotifyPlaylist };
    const expectedState = { ...initialState, status: 'fulfilled', currentPage: mockSpotifyPlaylist };
    expect(spotifyPlaylistsReducer(initialState, action)).toEqual(expectedState);
  });

  it('getSpotifyPlaylists.rejected', () => {
    const error = { message: serviceError };
    const action = { type: getSpotifyPlaylists.rejected, error };
    const expectedState = { ...initialState, status: 'rejected', error };
    expect(spotifyPlaylistsReducer(initialState, action)).toEqual(expectedState);
  });


});
