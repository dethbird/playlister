
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { apiRequest } from '../../app/apiConfig';

import userReducer, {
    initialState,
    getUser,
    getSpotifyUser,
    toggleTheme,
    signTos,
    signPP
} from './userSlice';
// import { getManagedPlaylists } from '../managedPlaylists/managedPlaylistsSlice';

const middlewares = [thunk]
const mockStore = configureStore(middlewares);

const serviceError = 'internal service error';

jest.mock('../../app/apiConfig', () => ({
    apiRequest: jest.fn(),
}));

describe('userSlice ', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.restoreAllMocks();
        jest.useRealTimers()
    });

    it('should handle initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('getUser pending then fulfilled', () => {

        const store = mockStore({})

        const resp = makeResp({});

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(getUser())
            .then(() => {
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(getUser.pending.type);
                expect(actionsDispatched[1].type).toEqual(getUser.fulfilled.type);
                expect(actionsDispatched[1].payload).toEqual({});
            });

    });

    it('getSpotifyUser pending then fulfilled', () => {

        const store = mockStore({})

        const resp = makeResp({});

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(getSpotifyUser())
            .then(() => {
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(getSpotifyUser.pending.type);
                expect(actionsDispatched[1].type).toEqual(getSpotifyUser.fulfilled.type);
                expect(actionsDispatched[1].payload).toEqual({});
            });

    });

    it('signTos pending then fulfilled', () => {

        const store = mockStore({})

        const resp = makeResp({});

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(signTos())
            .then(() => {
                jest.advanceTimersByTime(1250);
                const actionsDispatched = store.getActions();
                // dispatch(getUser()) is invoked inside the signTos thunk before signTos
                // resolves, so getUser.pending may appear before signTos.fulfilled.
                expect(actionsDispatched[0].type).toEqual(signTos.pending.type);
                // either getUser.pending appears before fulfilled, or fulfilled appears first
                // assert both exist in the dispatched actions in a stable way:
                const types = actionsDispatched.map(a => a.type);
                expect(types).toContain(signTos.fulfilled.type);
                expect(types).toContain(getUser.pending.type);
                // ensure fulfilled payload is the expected value
                const fulfilledAction = actionsDispatched.find(a => a.type === signTos.fulfilled.type);
                expect(fulfilledAction.payload).toEqual({});
            });

    });

    it('signPP pending then fulfilled', () => {

        const store = mockStore({})

        const resp = makeResp({});

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(signPP())
            .then(() => {
                jest.advanceTimersByTime(1250);
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(signPP.pending.type);
                const types = actionsDispatched.map(a => a.type);
                expect(types).toContain(signPP.fulfilled.type);
                expect(types).toContain(getUser.pending.type);
                const fulfilledAction = actionsDispatched.find(a => a.type === signPP.fulfilled.type);
                expect(fulfilledAction.payload).toEqual({});
            });

    });


    it('toggleTheme pending then fulfilled', () => {

        const store = mockStore({})

        const resp = makeResp({});

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(toggleTheme())
            .then(() => {
                jest.advanceTimersByTime(1250);
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(toggleTheme.pending.type);
                const types = actionsDispatched.map(a => a.type);
                expect(types).toContain(toggleTheme.fulfilled.type);
                expect(types).toContain(getUser.pending.type);
                const fulfilledAction = actionsDispatched.find(a => a.type === toggleTheme.fulfilled.type);
                expect(fulfilledAction.payload).toEqual({});
            });

    });

    it('getSpotifyUser.pending', () => {
        const action = { type: getSpotifyUser.pending };
        const expectedState = { ...initialState, status: 'pending' };
        expect(userReducer(initialState, action)).toEqual(expectedState);
    });

    it('getSpotifyUser.fulfilled', () => {
        const action = { type: getSpotifyUser.fulfilled, payload: { pizza: 'party'} };
        const expectedState = { ...initialState, status: 'fulfilled', spotifyUser: { pizza: 'party'} };
        expect(userReducer(initialState, action)).toEqual(expectedState);
    });

    it('getSpotifyUser.rejected', () => {
        const error = { message: serviceError };
        const action = { type: getSpotifyUser.rejected, error };
        const expectedState = { ...initialState, status: 'rejected', error };
        expect(userReducer(initialState, action)).toEqual(expectedState);
    });

    it('getUser.fulfilled', () => {
        const action = { type: getUser.fulfilled, payload: { pizza: 'party'} };
        const expectedState = { ...initialState, user: { pizza: 'party'} };
        expect(userReducer(initialState, action)).toEqual(expectedState);
    });

});
