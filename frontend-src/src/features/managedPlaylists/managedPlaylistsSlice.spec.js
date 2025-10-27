import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { notifications } from '@mantine/notifications';
import { apiRequest } from '../../app/apiConfig';
import managedPlaylistReducer,
{
  initialState,
  getPlaylistMeta,
  getManagedPlaylists,
  removeManagedPlaylist,
  togglePlaylistActive,
  setActiveAll,
  invertActiveAll,
  reorderPlaylists,
  addTrackToActive,
  removeTrackFromActive,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  toggleFavoritePlaylist,
  getFavoritePlaylists,
  addFavoritePlaylistToManaged,
  toggleFavoriteDialog,
  selectPlaylists
} from './managedPlaylistsSlice';
const middlewares = [thunk]
const mockStore = configureStore(middlewares);

const serviceError = 'internal service error';
const dummyResponse = { pizza: 'party' };
const dummyAction = { type: 'someAction' };

let mockPlaylistMetadata;
let mockPlaylistsResponse;
let mockSpotifyPlaylist;


jest.mock('../../app/apiConfig', () => ({
  apiRequest: jest.fn(),
}));


describe('managedPlaylistSlice ', () => {

  // Helper to produce a lightweight response-like object for tests.
  // Some environments/tests construct Response; using this helper avoids depending on global Response.
  function makeResp(payload, status = 200) {
    return {
      status,
      headers: { 'Content-type': 'application/json' },
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(payload),
      text: () => Promise.resolve(typeof payload === 'string' ? payload : JSON.stringify(payload)),
    };
  }

  beforeEach(() => {
    jest.useFakeTimers();
    mockPlaylistMetadata = {
      'XXX': {
        id: 'XXX',
        images: [
          { url: 'http://image' }
        ],
        tracks: {
          total: 100
        }
      }
    };
    mockSpotifyPlaylist = {
      id: 'XXX',
      images: [
        { url: 'http://image' }
      ],
      tracks: {
        total: 100
      }
    };
    mockPlaylistsResponse = [
      { id: 1, active: 'Y' },
      { id: 2, active: 'Y' },
      { id: 3, active: 'Y' },
    ];
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.useRealTimers()
  });

  it('should handle initial state', () => {
    expect(managedPlaylistReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('getManagedPlaylists pending then fulfilled', () => {

    const store = mockStore({})

    const resp = makeResp(mockPlaylistsResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getManagedPlaylists())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual(mockPlaylistsResponse);
      });

  });

  it('getManagedPlaylists pending then rejected', () => {

    const store = mockStore({})

    const promise = new Promise((_, reject) => setTimeout(reject(serviceError), 100));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getManagedPlaylists())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.rejected.type);
        expect(actionsDispatched[1].error).toEqual({ message: serviceError });
      });

  });

  it('getPlaylistMeta pending then fulfilled', () => {

    const store = mockStore({})

    const resp = makeResp(mockPlaylistMetadata);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getPlaylistMeta())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getPlaylistMeta.pending.type);
        expect(actionsDispatched[1].type).toEqual(getPlaylistMeta.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual(mockPlaylistMetadata);
      });

  });

  it('getPlaylistMeta pending then rejected', () => {

    const store = mockStore({})

    const promise = new Promise((_, reject) => setTimeout(reject(serviceError), 100));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getPlaylistMeta())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getPlaylistMeta.pending.type);
        expect(actionsDispatched[1].type).toEqual(getPlaylistMeta.rejected.type);
        expect(actionsDispatched[1].error).toEqual({ message: serviceError });
      });

  });

  it('removeManagedPlaylist pending then fulfilled, and getManagedPlaylists was called', () => {

    const store = mockStore({})

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(removeManagedPlaylist())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(removeManagedPlaylist.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(removeManagedPlaylist.fulfilled.type);
        expect(actionsDispatched[3].payload).toEqual(dummyResponse);
      });

  });

  it('togglePlaylistActive pending then fulfilled, and getManagedPlaylists was called', () => {

    const store = mockStore({})

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(togglePlaylistActive())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(togglePlaylistActive.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(togglePlaylistActive.fulfilled.type);
        expect(actionsDispatched[3].payload).toEqual(dummyResponse);
      });

  });

  it('setActiveAll pending then fulfilled, and getManagedPlaylists was called', () => {

    const store = mockStore({})

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(setActiveAll())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(setActiveAll.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(setActiveAll.fulfilled.type);
        expect(actionsDispatched[3].payload).toEqual(dummyResponse);
      });

  });

  it('invertActiveAll pending then fulfilled, and getManagedPlaylists was called', () => {

    const store = mockStore({})

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(invertActiveAll())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(invertActiveAll.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(invertActiveAll.fulfilled.type);
        expect(actionsDispatched[3].payload).toEqual(dummyResponse);
      });

  });

  it('reorderPlaylists pending then fulfilled, and getManagedPlaylists was called', () => {

    const store = mockStore({})

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(reorderPlaylists())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(reorderPlaylists.pending.type);
        expect(actionsDispatched[1].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(reorderPlaylists.fulfilled.type);
        expect(actionsDispatched[3].payload).toEqual(dummyResponse);
      });

  });

  it('addTrackToActive adds to active playlists, updates meta for active, and shows notification ', () => {

    const showSpy = jest.spyOn(notifications, 'show');

    const store = mockStore(
      {
        managedPlaylists: {
          playlists: mockPlaylistsResponse
        }
      }
    );

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(addTrackToActive())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(addTrackToActive.pending.type);
        expect(actionsDispatched[1].type).toEqual(addTrackToActive.fulfilled.type);
        for (let i = 2; i < 5; i++) {
          expect(actionsDispatched[i].type).toEqual(getPlaylistMeta.pending.type);
        }
        expect(showSpy).toHaveBeenCalled();
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('removeTrackFromActive adds to active playlists, updates meta for active, and shows notification ', () => {

    const showSpy = jest.spyOn(notifications, 'show');

    const store = mockStore(
      {
        managedPlaylists: {
          playlists: mockPlaylistsResponse
        }
      }
    );

    const resp = makeResp(dummyResponse);

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(removeTrackFromActive())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(removeTrackFromActive.pending.type);
        expect(actionsDispatched[1].type).toEqual(removeTrackFromActive.fulfilled.type);
        for (let i = 2; i < 5; i++) {
          expect(actionsDispatched[i].type).toEqual(getPlaylistMeta.pending.type);
        }
        expect(showSpy).toHaveBeenCalled();
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('addTrackToPlaylist uses currentTrack selector and adds to requested playlist, updates meta for playlist, and shows notification ', () => {

    const store = mockStore(
      {
        managedPlaylists: {
          playlists: mockPlaylistsResponse
        },
        player: {
          currentTrack: {
            item: {
              uri: '//trackUri'
            }
          }
        }
      }
    );

    const showSpy = jest.spyOn(notifications, 'show');

    const resp = makeResp(dummyResponse);
    const promise = new Promise(resolve => resolve(resp));
    apiRequest
      .mockResolvedValueOnce(promise);


    store.dispatch(addTrackToPlaylist())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(addTrackToPlaylist.pending.type);
        expect(actionsDispatched[1].type).toEqual(addTrackToPlaylist.fulfilled.type);
        expect(actionsDispatched[2].type).toEqual(getPlaylistMeta.pending.type);
        expect(showSpy).toHaveBeenCalled();
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('removeTrackFromPlaylist uses currentTrack selector and removes from requested playlist, updates meta for playlist, and shows notification ', () => {

    const store = mockStore(
      {
        managedPlaylists: {
          playlists: mockPlaylistsResponse
        },
        player: {
          currentTrack: {
            item: {
              uri: '//trackUri'
            }
          }
        }
      }
    );

    const showSpy = jest.spyOn(notifications, 'show');

    const resp = makeResp(dummyResponse);
    const promise = new Promise(resolve => resolve(resp));
    apiRequest
      .mockResolvedValueOnce(promise);


    store.dispatch(removeTrackFromPlaylist())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(removeTrackFromPlaylist.pending.type);
        expect(actionsDispatched[1].type).toEqual(removeTrackFromPlaylist.fulfilled.type);
        expect(actionsDispatched[2].type).toEqual(getPlaylistMeta.pending.type);
        expect(showSpy).toHaveBeenCalled();
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('toggleFavoritePlaylist toggles then, fetches manages playlists and favorite playlists', () => {

    const store = mockStore({});

    const resp = makeResp(dummyResponse);
    const promise = new Promise(resolve => resolve(resp));
    apiRequest
      .mockResolvedValueOnce(promise);


    store.dispatch(toggleFavoritePlaylist())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(toggleFavoritePlaylist.pending.type);
        expect(actionsDispatched[1].type).toEqual(toggleFavoritePlaylist.fulfilled.type);
        expect(actionsDispatched[2].type).toEqual(getManagedPlaylists.pending.type);
        expect(actionsDispatched[3].type).toEqual(getFavoritePlaylists.pending.type);
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('getFavoritePlaylists pending and fulfilled', () => {

    const store = mockStore({});

    const resp = makeResp(dummyResponse);
    const promise = new Promise(resolve => resolve(resp));
    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getFavoritePlaylists())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getFavoritePlaylists.pending.type);
        expect(actionsDispatched[1].type).toEqual(getFavoritePlaylists.fulfilled.type);
      }).catch(err => {
        console.log('err', err)
      });

  });


  it('addFavoritePlaylistToManaged pending and fulfilled, dispatch toggleDialog and getManagedPlaylists', () => {

    const store = mockStore({});

    const resp = makeResp(dummyResponse);
    const promise = new Promise(resolve => resolve(resp));
    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(addFavoritePlaylistToManaged())
      .then(() => {
        jest.advanceTimersByTime(300);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(addFavoritePlaylistToManaged.pending.type);
        expect(actionsDispatched[1].type).toEqual(addFavoritePlaylistToManaged.fulfilled.type);
        expect(actionsDispatched[2].type).toEqual(toggleFavoriteDialog.type);
        expect(actionsDispatched[3].type).toEqual(getManagedPlaylists.pending.type);
      }).catch(err => {
        console.log('err', err)
      });

  });

  it('toggleFavoriteDialog toggles favoriteDialogIsOpen in state', () => {
    const action = toggleFavoriteDialog();
    const expectedState = { ...initialState, favoriteDialogIsOpen: true }
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });

  it('getManagedPlaylists.fulfilled', () => {
    const action = { type: getManagedPlaylists.fulfilled, payload: mockPlaylistsResponse };
    const expectedState = { ...initialState, status: 'fulfilled', playlists: mockPlaylistsResponse };
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });

  it('getManagedPlaylists.rejected', () => {
    const error = { message: serviceError };
    const action = { type: getManagedPlaylists.rejected, error };
    const expectedState = { ...initialState, status: 'rejected', error };
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });

  it('getPlaylistMeta.fulfilled', () => {
    const action = { type: getPlaylistMeta.fulfilled, payload: mockSpotifyPlaylist };
    const expectedState = { ...initialState, playlistsMeta: mockPlaylistMetadata };
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });

  it('getFavoritePlaylists.fulfilled', () => {
    const action = { type: getFavoritePlaylists.fulfilled, payload: mockPlaylistsResponse };
    const expectedState = { ...initialState, favoriteStatus: 'fulfilled', favoritePlaylists: mockPlaylistsResponse };
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });

  it('getFavoritePlaylists.rejected', () => {
    const error = { message: serviceError };
    const action = { type: getFavoritePlaylists.rejected, error };
    const expectedState = { ...initialState, favoriteStatus: 'rejected', error };
    expect(managedPlaylistReducer(initialState, action)).toEqual(expectedState);
  });


});
