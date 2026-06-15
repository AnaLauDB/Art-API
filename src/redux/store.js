import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';

// Importar reducers
import authReducer from './slices/authSlice';
import artworksReducer from './slices/artworksSlice';
import dailyPickReducer from './slices/dailyPickSlice';
import filterReducer from './slices/filterSlice';
import uiReducer from './slices/uiSlice';

/**
 * Configuración de Redux Store
 * - Redux Toolkit para simplificar configuración
 * - Redux DevTools para debugging
 */
const store = configureStore(
    {
        reducer: {
            auth: authReducer,
            artworks: artworksReducer,
            dailyPick: dailyPickReducer,
            filters: filterReducer,
            ui: uiReducer,
        },
    },
    composeWithDevTools()
);

export default store;
