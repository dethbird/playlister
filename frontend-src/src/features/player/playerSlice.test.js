import playerReducer, {
  getCurrentTrack
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

});
