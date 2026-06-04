import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import { setProfileVisible } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../services/authServices';
import { getAvatar } from '../../services/avatarService';

/**
 * Header - Componente de Encabezado
 * 
 * ¿Qué hace?
 * - Muestra información del usuario si está logueado
 * - Botón de logout si está logueado
 * - Botón de login si NO está logueado
 * 
 * Conectado a Redux:
 * - auth.isLoggedIn: saber si está logueado
 * - auth.user: obtener datos del usuario
 * - dispatch: para hacer logout
 */
function Header() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const user = useSelector(state => state.auth.user);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            const a = getAvatar(user.id);
            setAvatar(a);
        } else {
            setAvatar(null);
        }
    }, [user]);

    const handleLogout = () => {
        // Limpiar localStorage
        logoutUser();

        // Actualizar Redux
        dispatch(logout());
    };

    const handleOpenAuthModal = () => {
        dispatch(setAuthModalVisible(true));
    };

    return (
        <header>
            <div>
                {isLoggedIn && user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {avatar ? (
                            <img src={avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : null}
                        <span> Bienvenido, {user.name}</span>
                        <button onClick={() => dispatch(setProfileVisible(true))}>
                            ⭐ Perfil
                        </button>
                        <button onClick={handleLogout}>
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <div>
                        <span>No has iniciado sesión</span>
                        <button onClick={handleOpenAuthModal}>
                            🔐 Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
