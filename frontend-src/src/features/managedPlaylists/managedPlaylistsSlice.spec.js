import { apiRequest } from '../../app/apiConfig';
import
managedPlaylistReducer,
{
  getManagedPlaylists
} from './managedPlaylistsSlice';

describe('managedPlaylistSlice ', () => {

  it('should handle initial state', () => {
    expect(managedPlaylistReducer(undefined, { type: 'unknown' })).toEqual({
      playlists: [],
      playlistsMeta: {},
      favoriteDialogIsOpen: false,
      favoritePlaylists: [],
      status: 'idle',
      favoriteStatus: 'idle',
      error: null
    });
  });

  it('should handle initial stat@e', () => {
    expect(managedPlaylistReducer(undefined, { type: 'unknown' })).toEqual({
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
