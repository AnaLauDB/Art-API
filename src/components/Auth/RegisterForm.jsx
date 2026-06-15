import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setUser, setError, setLoading } from "../../redux/slices/authSlice";
import { setAuthModalVisible } from "../../redux/slices/uiSlice";
import { registerUser } from "../../services/authServices";
import profileIcon from "../../assets/iconos/profile.svg";
import keyIcon from "../../assets/iconos/key.svg";
import emailIcon from "../../assets/iconos/email.svg";

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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));

      const result = await registerUser(data.email, data.password, data.name);

      dispatch(
        setUser({
          user: result.user,
          token: result.token,
        }),
      );

      dispatch(setAuthModalVisible(false));
    } catch (error) {
      setFormError("email", {
        type: "manual",
        message: error.message,
      });

      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <StyledWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="form_main">
        <h2 className="heading">Crear Cuenta</h2>

        <p className="subtitle">Crea tu perfil y guarda tus obras favoritas</p>

        {/* Nombre */}

        <div className="inputContainer">
          <img src={profileIcon} alt="" className="inputIcon" />

          <input
            type="text"
            className="inputField"
            placeholder="Nombre completo"
            {...register("name", {
              required: "El nombre es requerido",
              minLength: {
                value: 2,
                message: "El nombre debe tener mínimo 2 caracteres",
              },
            })}
          />
        </div>

        {errors.name && <p className="errorText">{errors.name.message}</p>}

        {/* Email */}

        <div className="inputContainer">
          <img src={emailIcon} alt="" className="inputIcon" />

          <input
            type="email"
            className="inputField"
            placeholder="tu@email.com"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email inválido",
              },
            })}
          />
        </div>

        {errors.email && <p className="errorText">{errors.email.message}</p>}

        {/* Password */}

        <div className="inputContainer">
          <img src={keyIcon} alt="" className="inputIcon" />

          <input
            type="password"
            className="inputField"
            placeholder="Contraseña"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener mínimo 6 caracteres",
              },
            })}
          />
        </div>

        {errors.password && (
          <p className="errorText">{errors.password.message}</p>
        )}

        {/* Confirmar */}

        <div className="inputContainer">
          <img src={keyIcon} alt="" className="inputIcon" />

          <input
            type="password"
            className="inputField"
            placeholder="Confirmar contraseña"
            {...register("confirmPassword", {
              required: "Debes confirmar la contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
        </div>

        {errors.confirmPassword && (
          <p className="errorText">{errors.confirmPassword.message}</p>
        )}

        <button type="submit" className="loginButton">
          Crear Cuenta
        </button>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form_main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form_main::before {
    position: absolute;
    content: "";
    width: 320px;
    height: 320px;
    background: linear-gradient(
      135deg,
      rgba(191, 156, 115, 0.18),
      rgba(166, 118, 77, 0.08)
    );
    transform: rotate(45deg);
    left: -240px;
    bottom: 10px;
    border-radius: 40px;
    z-index: 0;
    pointer-events: none;
  }

  .heading {
    margin: 0;
    z-index: 1;
    font-family: "Cormorant Garamond", serif;
    font-size: 2.2rem;
    line-height: 1;
    font-weight: 700;
    color: #7b5a42;
    text-align: center;
  }

  .subtitle {
    margin: 0.75rem 0 1.5rem;
    z-index: 1;
    font-family: "Inter", sans-serif;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #8f7158;
    text-align: center;
  }

  .inputContainer {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 1;
    margin-bottom: 0.75rem;
  }

  .inputIcon {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    opacity: 0.85;
    pointer-events: none;
    filter: sepia(35%) saturate(350%) hue-rotate(344deg) brightness(85%);
  }

  .inputField {
    width: 100%;
    height: 52px;
    background: #fff;
    border: 1px solid #e3d5c6;
    border-radius: 14px;
    color: #2e2e2e;
    font-family: "Inter", sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    box-sizing: border-box;
    padding-left: 44px;
    padding-right: 14px;
    transition: all 0.25s ease;
  }

  .inputField:focus {
    outline: none;
    border-color: #b88a5b;
    box-shadow: 0 0 0 4px rgba(184, 138, 91, 0.14);
  }

  .inputField::placeholder {
    color: #a48a74;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .errorText {
    margin: -0.25rem 0 0.75rem;
    color: #9d5546;
    font-size: 0.85rem;
    font-family: "Inter", sans-serif;
    z-index: 1;
  }

  .loginButton {
    z-index: 1;
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #a6764d, #7b5a42);
    color: #fff;
    font-family: "Inter", sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease;
    box-shadow: 0 8px 18px rgba(123, 90, 66, 0.18);
    margin-top: 0.5rem;
  }

  .loginButton:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(123, 90, 66, 0.24);
    background: linear-gradient(135deg, #b07b50, #6d4c41);
  }

  .loginButton:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  @media (max-width: 480px) {
    .form_main {
      padding: 1.5rem;
      border-radius: 20px;
    }

    .heading {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 0.9rem;
    }
  }
`;
export default RegisterForm;
