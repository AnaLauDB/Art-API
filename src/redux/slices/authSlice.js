import { createSlice } from '@reduxjs/toolkit';

/**
 * authSlice - Manejo del estado de autenticación
 * Almacena: usuario logueado, token, estado de carga
 */
const initialState = {
    user: null,           // { id, email, name }
    isLoggedIn: false,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Acciones síncronas
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.error = null;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.error = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setUser, setLoading, setError, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
