import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './managedPlaylistsSlice';

describe('managedPlaylistSlice ', () => {

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
