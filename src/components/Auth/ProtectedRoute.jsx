import { useSelector, useDispatch } from 'react-redux';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import AuthModal from './AuthModal';

/**
 * ProtectedRoute - Componente de Ruta Protegida
 * 
 * ¿Qué hace?
 * - Verifica si el usuario está autenticado
 * - Si NO está autenticado → muestra AuthModal
 * - Si SÍ está autenticado → renderiza componentes hijos
 * 
 * Uso en App.jsx:
 * <ProtectedRoute>
 *   <DailyArtwork />
 *   <ArtworkGrid />
 * </ProtectedRoute>
 * 
 * Solo usuarios logueados verán estos componentes
 */
function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // Si NO está logueado
    if (!isLoggedIn) {
        // Mostrar AuthModal
        dispatch(setAuthModalVisible(true));

        return (
            <div>
                <h2>⚠️ Acceso Restringido</h2>
                <p>Debes estar registrado para acceder a esta sección.</p>
                <AuthModal />
            </div>
        );
    }

    // Si SÍ está logueado, renderizar componentes hijos
    return children;
}

export default ProtectedRoute;
