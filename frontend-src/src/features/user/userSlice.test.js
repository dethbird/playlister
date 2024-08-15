
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { apiRequest } from '../../app/apiConfig';

import userReducer, {
    initialState,
    getUser,
    getSpotifyUser,
    toggleTheme
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

        const resp = new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-type': 'application/json' }
        });

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(getUser({ limit: 25, offset: 0 }))
            .then(() => {
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(getUser.pending.type);
                expect(actionsDispatched[1].type).toEqual(getUser.fulfilled.type);
                expect(actionsDispatched[1].payload).toEqual({});
            });

    });

    it('getSpotifyUser pending then fulfilled', () => {

        const store = mockStore({})

        const resp = new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-type': 'application/json' }
        });

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(getSpotifyUser({ limit: 25, offset: 0 }))
            .then(() => {
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(getSpotifyUser.pending.type);
                expect(actionsDispatched[1].type).toEqual(getSpotifyUser.fulfilled.type);
                expect(actionsDispatched[1].payload).toEqual({});
            });

    });

    it('toggleTheme pending then fulfilled', () => {

        const store = mockStore({})

        const resp = new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-type': 'application/json' }
        });

        const promise = new Promise(resolve => resolve(resp));

        apiRequest
            .mockResolvedValueOnce(promise);

        store.dispatch(toggleTheme({ limit: 25, offset: 0 }))
            .then(() => {
                jest.advanceTimersByTime(1250);
                const actionsDispatched = store.getActions();
                expect(actionsDispatched[0].type).toEqual(toggleTheme.pending.type);
                expect(actionsDispatched[1].type).toEqual(toggleTheme.fulfilled.type);
                expect(actionsDispatched[1].payload).toEqual({});
                expect(actionsDispatched[2].type).toEqual(getUser.pending.type);
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
