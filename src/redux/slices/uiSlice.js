import { createSlice } from '@reduxjs/toolkit';

/**
 * uiSlice - Manejo del estado de UI (interfaz de usuario)
 * Almacena: modales, mensajes de carga, visibilidad de componentes
 */
const initialState = {
    showAuthModal: false,     // Mostrar modal de login/registro
    isLoading: false,         // Indicador global de carga
    notification: {           // Mensaje flotante para usuario
        type: null,             // 'success', 'error', 'info'
        message: '',
        visible: false,
    },
    sidebarOpen: false,       // Para navegación móvil
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleAuthModal: (state) => {
            state.showAuthModal = !state.showAuthModal;
        },

        setAuthModalVisible: (state, action) => {
            state.showAuthModal = action.payload;
        },

        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        showNotification: (state, action) => {
            state.notification = {
                type: action.payload.type,      // 'success', 'error', 'info'
                message: action.payload.message,
                visible: true,
            };
        },

        hideNotification: (state) => {
            state.notification.visible = false;
        },

        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },

        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const {
    toggleAuthModal,
    setAuthModalVisible,
    setIsLoading,
    showNotification,
    hideNotification,
    toggleSidebar,
    setSidebarOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
