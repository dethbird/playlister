import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './spotifyPlaylistsSlice';

describe('spotifyPlaylistsSlice', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      currentPage: null,
      dialogIsOpen: false,
      status: 'idle',
      error: null,
      limit: 25,
      offset: 0
    });
  });
});
