import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './managedPlaylistsSlice';

describe('managedPlaylistSlice ', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      playlists: [],
      playlistsMeta: {},
      favoriteDialogIsOpen: false,
      favoritePlaylists: [],
      status: 'idle',
      favoriteStatus: 'idle',
      error: null
    });
  });
});
