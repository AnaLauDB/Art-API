import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import {
  setAuthModalVisible,
  setProfileVisible,
  setDailyArtworkVisible,
} from "../../redux/slices/uiSlice";
import { logoutUser } from "../../services/authServices";
import { getAvatar } from "../../services/avatarService";
import ButtonsHeader from "./Buttom";
import logoutIcon from "../../assets/iconos/logout.svg";
import profileIcon from "../../assets/iconos/profile.svg";
import loginIcon from "../../assets/iconos/login.svg";
import dailyIcon from "../../assets/iconos/artwork.svg";
import styles from "../../styles/Header.module.css";

function Header() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const user = useSelector((state) => state.auth.user);

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setAvatar(getAvatar(user.id));
    } else {
      setAvatar(null);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
  };

  const handleOpenAuthModal = () => {
    dispatch(setAuthModalVisible(true));
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {isLoggedIn && user ? (
          <>
            {/* Información usuario */}
            <div className={styles.userSection}>
              {avatar && (
                <img src={avatar} alt="Avatar" className={styles.avatar} />
              )}

              <div className={styles.userInfo}>
                <span className={styles.welcome}>Bienvenida, {user.name}</span>

                <span className={styles.subtitle}>
                  Explora nuevas obras hoy
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className={styles.actions}>
              <ButtonsHeader
                variant="daily"
                onClick={() => dispatch(setDailyArtworkVisible(true))}
              >
                <div className="button-inner">
                  <img src={dailyIcon} alt="Obra del día" />
                  Obra del Día
                </div>
              </ButtonsHeader>

              <ButtonsHeader
                variant="profile"
                onClick={() => dispatch(setProfileVisible(true))}
              >
                <div className="button-inner">
                  <img src={profileIcon} alt="Perfil" />
                  Perfil
                </div>
              </ButtonsHeader>

              <ButtonsHeader variant="logout" onClick={handleLogout}>
                <div className="button-inner">
                  <img src={logoutIcon} alt="Cerrar sesión" />
                  Salir
                </div>
              </ButtonsHeader>
            </div>
          </>
        ) : (
          <>
            <div className={styles.guestSection}>
              <div className={styles.userInfo}>
                <span className={styles.welcome}>Cleveland Art Museum</span>

                <span className={styles.subtitle}>
                  Inicia sesión para guardar favoritos
                </span>
              </div>

              <ButtonsHeader variant="login" onClick={handleOpenAuthModal}>
                <div className="button-inner">
                  <img src={loginIcon} alt="Iniciar sesión" />
                  Iniciar sesión
                </div>
              </ButtonsHeader>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
