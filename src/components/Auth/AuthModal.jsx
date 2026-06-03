import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from '../../styles/AuthModal.module.css';

/**
 * AuthModal - Modal de Autenticación
 * 
 * ¿Qué hace?
 * - Muestra modal con formularios de login/registro
 * - Permite cambiar entre login y registro sin navegar
 * - Se abre solo cuando usuario NO está autenticado
 * - Se cierra cuando el login es exitoso
 * 
 * Estado local:
 * - isLogin: si es true muestra login, si es false muestra registro
 */
function AuthModal() {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const showModal = useSelector(state => state.ui.showAuthModal);

    // Si no debe mostrar el modal, retornar null
    if (!showModal) {
        return null;
    }

    const handleToggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleCloseModal = () => {
        dispatch(setAuthModalVisible(false));
    };

    return (
        <div className={styles['auth-modal-container']}>
            <div className={styles['auth-modal-backdrop']} onClick={handleCloseModal}>
                {/* Backdrop oscuro detrás del modal */}
            </div>

            <div className={styles['auth-modal-content']}>
                {/* Botón para cerrar modal */}
                <button
                    className={styles['auth-modal-close']}
                    onClick={handleCloseModal}
                    type="button"
                    aria-label="Cerrar modal"
                >
                    ✕
                </button>

                {/* Contenido del modal */}
                {isLogin ? (
                    <>
                        <LoginForm />
                        <p>
                            ¿No tienes cuenta?{' '}
                            <button onClick={handleToggleForm} type="button">
                                Regístrate aquí
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm />
                        <p>
                            ¿Ya tienes cuenta?{' '}
                            <button onClick={handleToggleForm} type="button">
                                Inicia sesión aquí
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthModal;
