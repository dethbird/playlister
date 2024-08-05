import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';

const initialState = {
  user: {},
  spotifyUser: {},
  status: 'idle',
  error: null
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => {
    const response = await apiRequest('/me');
    const data = await response.json();
    return data;
  }
);

export const getSpotifyUser = createAsyncThunk(
    'user/getSpotifyUser',
    async () => {
      const response = await apiRequest('/me/spotify');
      const data = await response.json();
      return data;
    }
  );


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpotifyUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getSpotifyUser.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.spotifyUser = action.payload;
      })
      .addCase(getSpotifyUser.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});


export const selectUser = (state) => state.user.user;
export const selectSpotifyUser = (state) => state.user.spotifyUser;



export default userSlice.reducer;
