import { createSlice } from '@reduxjs/toolkit';

/**
 * artworksSlice - Manejo del estado de obras de arte
 * Almacena: lista de obras, obra seleccionada, paginación
 */
const initialState = {
    items: [],              // Array de obras
    selectedArtwork: null,  // { id, title, image_id, ... }
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    loading: false,
    error: null,
};

const artworksSlice = createSlice({
    name: 'artworks',
    initialState,
    reducers: {
        setArtworks: (state, action) => {
            state.items = action.payload.data || [];
            state.totalPages = action.payload.pagination?.total_pages || 0;
            state.totalResults = action.payload.pagination?.total || 0;
            state.error = null;
        },

        selectArtwork: (state, action) => {
            state.selectedArtwork = action.payload;
        },

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        clearArtworks: (state) => {
            state.items = [];
            state.selectedArtwork = null;
            state.currentPage = 1;
            state.totalPages = 0;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setArtworks,
    selectArtwork,
    setCurrentPage,
    setLoading,
    setError,
    clearArtworks,
    clearError,
} = artworksSlice.actions;
export default artworksSlice.reducer;
