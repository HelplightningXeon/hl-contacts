// A redux slice to handle authentication
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        pat: null,
        user: null,
        status: 'idle',
    },
    reducers: {
        auth: (state, action) => {
            state.isAuthenticated = true;
            state.pat = action.payload.pat
        },
        login: (state, action) => {
            state.user = action.payload.user;
        }
    }
});

export const { auth, login } = authSlice.actions;

export const user = state => state.auth.user;

export default authSlice.reducer;