import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import { setProfileVisible } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../services/authServices';

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
                    <div>
                        <span>👤 Bienvenido, {user.name}</span>
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
