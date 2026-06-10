import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalVisible } from "../../redux/slices/uiSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "../../styles/AuthModal.module.css";

function AuthModal() {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);

  const showModal = useSelector((state) => state.ui.showAuthModal);

  if (!showModal) return null;

  const handleCloseModal = () => {
    dispatch(setAuthModalVisible(false));
  };

  const handleToggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.backdrop} onClick={handleCloseModal} />

      <div className={styles.modalCard}>
        <button
          className={styles.closeButton}
          onClick={handleCloseModal}
          type="button"
        >
          ✕
        </button>

        {/* <div className={styles.header}>
          <h2>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

          <p>
            {isLogin
              ? "Accede para guardar tus obras favoritas y personalizar tu experiencia."
              : "Únete a la comunidad del Cleveland Art Museum."}
          </p>
        </div> */}

        <div className={styles.formWrapper}>
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className={styles.footer}>
          {isLogin ? (
            <>
              <span>¿No tienes cuenta?</span>

              <button
                type="button"
                className={styles.switchButton}
                onClick={handleToggleForm}
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              <span>¿Ya tienes cuenta?</span>

              <button
                type="button"
                className={styles.switchButton}
                onClick={handleToggleForm}
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
