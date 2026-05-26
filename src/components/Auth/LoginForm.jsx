import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser, setError, setLoading } from '../../redux/slices/authSlice';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import { loginUser } from '../../services/authServices';

/**
 * LoginForm - Componente de Login
 * 
 * ¿Qué hace?
 * - Muestra formulario para login
 * - Valida datos con React Hook Form
 * - Envía datos a authServices
 * - Guarda en Redux si es exitoso
 * - Cierra modal si es exitoso
 * 
 * React Hook Form
 * - register: conecta input a form
 * - handleSubmit: maneja envío del formulario
 * - formState: errores del formulario
 * - watch: mira cambios en campos (opcional)
 */
function LoginForm() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setError: setFormError } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    /**
     * onSubmit se ejecuta cuando el usuario envía el formulario
     */
    const onSubmit = async (data) => {
        try {
            dispatch(setLoading(true));

            // Llamar servicio de login
            const result = await loginUser(data.email, data.password);

            // Guardar en Redux
            dispatch(setUser({
                user: result.user,
                token: result.token,
            }));

            // Cerrar modal
            dispatch(setAuthModalVisible(false));
        } catch (error) {
            // Mostrar error en el formulario
            setFormError('email', {
                type: 'manual',
                message: error.message,
            });
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Inicia Sesión</h2>

            {/* Campo Email */}
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido',
                        },
                    })}
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            {/* Campo Contraseña */}
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                            value: 6,
                            message: 'La contraseña debe tener mínimo 6 caracteres',
                        },
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            {/* Botón Enviar */}
            <button type="submit">
                ✅ Iniciar Sesión
            </button>
        </form>
    );
}

export default LoginForm;
