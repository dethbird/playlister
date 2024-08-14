import playerReducer, {
  increment
} from './playerSlice';

describe('playerReducer', () => {
  const initialState = {
    currentTrack: {},
    isPlaying: false,
    isLiked: false,
    status: 'idle',
    error: null
  };
  it('should handle initial state', () => {
    expect(playerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // it('should handle increment', () => {
  //   const actual = counterReducer(initialState, increment());
  //   expect(actual.value).toEqual(4);
  // });

});
