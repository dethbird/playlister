import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { apiRequest } from '../../app/apiConfig';

import playerReducer, {
  initialState,
  getCurrentTrack,
  play,
  pause,
  previous,
  next,
  liked,
  like,
  unlike
} from './playerSlice';

const middlewares = [thunk]
const mockStore = configureStore(middlewares);

const serviceError = 'internal service error';

let mockPlaylistMetadata;
let mockPlaylistsResponse;
let mockSpotifyPlaylist;

jest.mock('../../app/apiConfig', () => ({
  apiRequest: jest.fn(),
}));

describe('playerSlice ', () => {

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
    expect(playerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('getCurrentTrack pending then fulfilled', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify(mockPlaylistsResponse), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(getCurrentTrack())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(getCurrentTrack.pending.type);
        expect(actionsDispatched[1].type).toEqual(getCurrentTrack.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual(mockPlaylistsResponse);
      });

  });

  it('play pending then fulfilled', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(play())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(play.pending.type);
        expect(actionsDispatched[1].type).toEqual(play.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual({});
      });

  });

  it('pause pending then fulfilled', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(pause())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(pause.pending.type);
        expect(actionsDispatched[1].type).toEqual(pause.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual({});
      });

  });

  it('previous pending then fulfilled, then get current track', () => {

    const store = mockStore({
      player: {
        currentTrack: { item: { id: 'track1' } }
      }
    })

    const resp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const getCurrentTrackResp = new Response(JSON.stringify({ item: { id: 'track2' } }), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));
    const getCurrentTrackPromise = new Promise(resolve => resolve(getCurrentTrackResp));

    apiRequest
      .mockResolvedValueOnce(promise)
      .mockResolvedValueOnce(getCurrentTrackPromise);

    store.dispatch(previous())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(previous.pending.type);
        expect(actionsDispatched[1].type).toEqual(previous.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual({});
        expect(actionsDispatched[2].type).toEqual(getCurrentTrack.pending.type);
      });

  });


  it('next pending then fulfilled, then get current track', () => {

    const store = mockStore({
      player: {
        currentTrack: { item: { id: 'track1' } }
      }
    })

    const resp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const getCurrentTrackResp = new Response(JSON.stringify({ item: { id: 'track2' } }), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));
    const getCurrentTrackPromise = new Promise(resolve => resolve(getCurrentTrackResp));

    apiRequest
      .mockResolvedValueOnce(promise)
      .mockResolvedValueOnce(getCurrentTrackPromise);

    store.dispatch(next())
      .then(() => {
        jest.advanceTimersByTime(1250);
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(next.pending.type);
        expect(actionsDispatched[1].type).toEqual(next.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual({});
        expect(actionsDispatched[2].type).toEqual(getCurrentTrack.pending.type);
      });

  });

  it('next with retry logic - includes current track state', () => {
    const store = mockStore({
      player: {
        currentTrack: { item: { id: 'track1' } }
      }
    });

    const nextResp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const getCurrentTrackResp = new Response(JSON.stringify({ item: { id: 'track2' } }), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    apiRequest
      .mockResolvedValueOnce(Promise.resolve(nextResp))
      .mockResolvedValueOnce(Promise.resolve(getCurrentTrackResp));

    store.dispatch(next()).then(() => {
      jest.advanceTimersByTime(1250);
      
      const actions = store.getActions();
      expect(actions[0].type).toEqual(next.pending.type);
      expect(actions[1].type).toEqual(next.fulfilled.type);
      
      // Should trigger getCurrentTrack due to retry logic
      expect(actions.filter(a => a.type === getCurrentTrack.pending.type).length).toBeGreaterThan(0);
    });
  });

  it('previous with retry logic - includes current track state', () => {
    const store = mockStore({
      player: {
        currentTrack: { item: { id: 'track1' } }
      }
    });

    const prevResp = new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const getCurrentTrackResp = new Response(JSON.stringify({ item: { id: 'track2' } }), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    apiRequest
      .mockResolvedValueOnce(Promise.resolve(prevResp))
      .mockResolvedValueOnce(Promise.resolve(getCurrentTrackResp));

    store.dispatch(previous()).then(() => {
      jest.advanceTimersByTime(1250);
      
      const actions = store.getActions();
      expect(actions[0].type).toEqual(previous.pending.type);
      expect(actions[1].type).toEqual(previous.fulfilled.type);
      
      // Should trigger getCurrentTrack due to retry logic
      expect(actions.filter(a => a.type === getCurrentTrack.pending.type).length).toBeGreaterThan(0);
    });
  });


  it('liked pending then fulfilled, the gets current track', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify([true]), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(liked())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(liked.pending.type);
        expect(actionsDispatched[1].type).toEqual(liked.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual(true);
      });

  });


  it('like pending then fulfilled, the gets current track', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify([true]), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(like())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(like.pending.type);
        expect(actionsDispatched[1].type).toEqual(like.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual([true]);
      });

  });


  it('unlike pending then fulfilled, the gets current track', () => {

    const store = mockStore({})

    const resp = new Response(JSON.stringify([true]), {
      status: 200,
      headers: { 'Content-type': 'application/json' }
    });

    const promise = new Promise(resolve => resolve(resp));

    apiRequest
      .mockResolvedValueOnce(promise);

    store.dispatch(unlike())
      .then(() => {
        const actionsDispatched = store.getActions();
        expect(actionsDispatched[0].type).toEqual(unlike.pending.type);
        expect(actionsDispatched[1].type).toEqual(unlike.fulfilled.type);
        expect(actionsDispatched[1].payload).toEqual([true]);
      });

  });

  it('getCurrentTrack.pending', () => {
    const action = { type: getCurrentTrack.pending };
    const expectedState = { ...initialState, status: 'pending' };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('getCurrentTrack.fulfilled', () => {
    const action = { type: getCurrentTrack.fulfilled, payload: mockSpotifyPlaylist };
    const expectedState = { ...initialState, status: 'fulfilled', currentTrack: mockSpotifyPlaylist, isPlaying: mockSpotifyPlaylist.is_playing };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('getCurrentTrack.rejected', () => {
    const error = { message: serviceError };
    const action = { type: getCurrentTrack.rejected, error };
    const expectedState = { ...initialState, status: 'rejected', error };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('play.fulfilled', () => {
    const action = { type: play.fulfilled };
    const expectedState = { ...initialState, isPlaying: true };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('pause.fulfilled', () => {
    const action = { type: pause.fulfilled };
    const expectedState = { ...initialState, isPlaying: false };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });


  it('liked.fulfilled', () => {
    const action = { type: liked.fulfilled, payload: true };
    const expectedState = { ...initialState, isLiked: true };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('like.fulfilled', () => {
    const action = { type: like.fulfilled };
    const expectedState = { ...initialState, isLiked: true };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

  it('unlike.fulfilled', () => {
    const action = { type: unlike.fulfilled };
    const expectedState = { ...initialState, isLiked: false };
    expect(playerReducer(initialState, action)).toEqual(expectedState);
  });

});
