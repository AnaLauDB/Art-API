import { createSlice } from '@reduxjs/toolkit';

/**
 * dailyPickSlice - Manejo del estado de la obra de arte diaria
 * Almacena: obra del día, fecha de última carga, estado de carga
 */
const initialState = {
    artwork: null,        // { id, title, image_id, ... }
    date: null,           // "2026-05-21" - Fecha de la obra
    loading: false,
    error: null,
};

const dailyPickSlice = createSlice({
    name: 'dailyPick',
    initialState,
    reducers: {
        setDailyArtwork: (state, action) => {
            state.artwork = action.payload.artwork;
            state.date = action.payload.date;
            state.error = null;
            state.loading = false;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        clearDailyArtwork: (state) => {
            state.artwork = null;
            state.date = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setDailyArtwork,
    setLoading,
    setError,
    clearDailyArtwork,
    clearError,
} = dailyPickSlice.actions;
export default dailyPickSlice.reducer;
