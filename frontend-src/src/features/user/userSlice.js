import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../app/apiConfig';

export const initialState = {
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

export const toggleTheme = createAsyncThunk(
    'user/toggleTheme',
    async (_, {dispatch}) => {
        const response = await apiRequest('/me/toggle-theme', {
            method: 'PUT'
        });
        const data = await response.json();
        setTimeout(() => {
            dispatch(getUser());
        }, 250);
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
                state.error = action.error;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});


export const selectUser = (state) => state.user.user;
export const selectSpotifyUser = (state) => state.user.spotifyUser;



export default userSlice.reducer;
