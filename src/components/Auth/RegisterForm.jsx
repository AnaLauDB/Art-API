import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser, setError, setLoading } from '../../redux/slices/authSlice';
import { setAuthModalVisible } from '../../redux/slices/uiSlice';
import { registerUser } from '../../services/authServices';

/**
 * RegisterForm - Componente de Registro
 * 
 * ¿Qué hace?
 * - Muestra formulario para crear cuenta
 * - Valida datos con React Hook Form
 * - Envía datos a authServices
 * - Guarda en Redux si es exitoso
 * - Cierra modal si es exitoso
 * 
 * Validaciones:
 * - Email válido
 * - Contraseña mínimo 6 caracteres
 * - Las contraseñas coinciden (watch para comparar)
 * - Nombre no vacío
 */
function RegisterForm() {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError: setFormError,
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    // Watch para comparar contraseñas
    const password = watch('password');

    /**
     * onSubmit se ejecuta cuando el usuario envía el formulario
     */
    const onSubmit = async (data) => {
        try {
            dispatch(setLoading(true));

            // Llamar servicio de registro
            const result = await registerUser(data.email, data.password, data.name);

            // Guardar en Redux
            dispatch(setUser({
                user: result.user,
                token: result.token,
            }));

            // Cerrar modal
            dispatch(setAuthModalVisible(false));
        } catch (error) {
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
            <h2>Crear Cuenta</h2>

            {/* Campo Nombre */}
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    placeholder="Tu nombre"
                    {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 2,
                            message: 'El nombre debe tener mínimo 2 caracteres',
                        },
                    })}
                />
                {errors.name && <p>{errors.name.message}</p>}
            </div>

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

            {/* Campo Confirmar Contraseña */}
            <div>
                <label>Confirmar Contraseña:</label>
                <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    {...register('confirmPassword', {
                        required: 'Debes confirmar la contraseña',
                        validate: (value) =>
                            value === password || 'Las contraseñas no coinciden',
                    })}
                />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>

            {/* Botón Enviar */}
            <button type="submit">
                ✅ Crear Cuenta
            </button>
        </form>
    );
}

export default RegisterForm;
