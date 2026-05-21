import { createSlice } from '@reduxjs/toolkit';

/**
 * filterSlice - Manejo del estado de filtros
 * Almacena: criterios de búsqueda y filtros aplicados
 */
const initialState = {
    searchQuery: '',      // "Van Gogh"
    filterCriteria: {     // { artist_title, date, medium, etc }
        artist_title: '',
        date_display: '',
        medium_display: '',
    },
    sortBy: 'relevance',  // 'relevance', 'date', 'title'
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        setFilterCriteria: (state, action) => {
            state.filterCriteria = {
                ...state.filterCriteria,
                ...action.payload,
            };
        },

        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },

        clearFilters: (state) => {
            state.searchQuery = '';
            state.filterCriteria = {
                artist_title: '',
                date_display: '',
                medium_display: '',
            };
            state.sortBy = 'relevance';
        },

        clearError: (state) => {
            // Placeholder para mantener consistencia
        },
    },
});

export const {
    setSearchQuery,
    setFilterCriteria,
    setSortBy,
    clearFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
