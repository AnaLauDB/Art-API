import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFavorites, removeFavorite } from "../services/favoritesService";
import ArtworkCard from "./ArtworkCard";
import ArtworkDetail from "./ArtworkDetail";
import { getArtworkDetails } from "../services/arteServices";
import { setProfileVisible } from "../redux/slices/uiSlice";
import {
  setCurrentPage,
  searchArtworksAsync,
} from "../redux/slices/artworksSlice";
import { getAvatar, setAvatar } from "../services/avatarService";
import backIcon from "../assets/iconos/arrow_back.svg";
import deleteIcon from "../assets/iconos/delete.svg";
import styles from "../styles/UserProfile.module.css";
import ArtworkActionButton from "./ArtworkActionButton";

const AVAILABLE_ASSETS = [
  "/src/assets/icons_users/boy1.png",
  "/src/assets/icons_users/girl1.png",
  "/src/assets/icons_users/boy2.png",
  "/src/assets/icons_users/girl2.png",
  "/src/assets/icons_users/boy3.png",
  "/src/assets/icons_users/girl3.png",
  "/src/assets/icons_users/boy4.png",
  "/src/assets/icons_users/girl4.png",
  "/src/assets/icons_users/boy5.png",
  "/src/assets/icons_users/girl5.png",
];

const INTEREST_OPTIONS = [
  "Pintura",
  "Escultura",
  "Fotografía",
  "Arte moderno",
  "Arte clásico",
  "Grabado",
  "Dibujo",
  "Cerámica",
  "Arquitectura",
  "Textiles",
  "Historia del arte",
  "Restauración",
  "Museos",
  "Exposiciones",
  "Objetos de colección",
];

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);

  const [favorites, setFavorites] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const list = getFavorites(user.id);
    setFavorites(list);

    const avatar = getAvatar(user.id);
    setCurrentAvatar(avatar);

    import("../services/profileService")
      .then((mod) => {
        const p = mod.getProfile(user.id);
        setDescription(p.description || "");
        setSelectedInterests(Array.isArray(p.hobbies) ? p.hobbies : []);
      })
      .catch(() => {});
  }, [user]);

  const handleBack = () => {
    dispatch(setProfileVisible(false));
    dispatch(setCurrentPage(1));
    dispatch(searchArtworksAsync({ query: "art", limit: 12, page: 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (id) => {
    removeFavorite(id, user?.id);
    setFavorites(getFavorites(user?.id));
  };

  const handleSelectAvatar = (assetPath) => {
    setCurrentAvatar(assetPath);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const handleSaveProfile = async () => {
    const mod = await import("../services/profileService");
    mod.saveProfile(user?.id, {
      description,
      hobbies: selectedInterests,
    });

    if (currentAvatar) {
      setAvatar(user?.id, currentAvatar);
    }

    alert("Perfil guardado.");
  };

  if (!isLoggedIn || !user) return null;

  return (
    <div className={styles.profilePage}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Perfil de {user.name}</h2>

        <button
          onClick={handleBack}
          className={styles.backButton}
          aria-label="Volver"
          type="button"
        >
          <img src={backIcon} alt="Volver" className={styles.backIcon} />
        </button>
      </div>

      <div className={styles.topGrid}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Avatar</h3>

          <div className={styles.avatarBox}>
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Avatar"
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>No avatar</div>
            )}

            <h4 className={styles.username}>@{user.email?.split("@")[0]}</h4>
          </div>
        </section>

        <section className={`${styles.card} ${styles.aboutCard}`}>
          <h3 className={styles.cardTitle}>Acerca de mí</h3>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe una breve descripción sobre ti y tu interés en el arte"
            className={styles.textarea}
          />

          <button
            onClick={handleSaveProfile}
            type="button"
            className={styles.saveButton}
          >
            Guardar perfil
          </button>
        </section>
      </div>

      <section className={styles.fullWidthSection}>
        <h3 className={styles.sectionTitle}>Intereses</h3>

        <div className={styles.interestsGrid}>
          {INTEREST_OPTIONS.map((interest) => {
            const active = selectedInterests.includes(interest);

            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`${styles.interestButton} ${
                  active ? styles.interestButtonActive : ""
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.fullWidthSection}>
        <h3 className={styles.sectionTitle}>Seleccionar avatar</h3>

        <div className={styles.avatarPickerGrid}>
          {AVAILABLE_ASSETS.map((asset) => (
            <button
              key={asset}
              type="button"
              onClick={() => handleSelectAvatar(asset)}
              className={styles.avatarPickerButton}
            >
              <img
                src={asset}
                alt="avatar"
                className={styles.avatarPickerImage}
              />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.fullWidthSection}>
        <h2 className={styles.sectionTitleLarge}>
          Obras favoritas ({favorites.length})
        </h2>

        {favorites.length === 0 ? (
          <p className={styles.emptyState}>No tienes obras favoritas aún.</p>
        ) : (
          <div className={styles.favoritesGrid}>
            {favorites.map((a) => (
              <div key={a.id} className={styles.favoriteItem}>
                <ArtworkCard
                  artwork={a}
                  onClick={() => setSelectedArtwork(a)}
                />

                <ArtworkActionButton
                  variant="delete"
                  data-tip="Eliminar favorito"
                  onClick={() => handleRemove(a.id)}
                >
                  <img src={deleteIcon} alt="Eliminar" />
                </ArtworkActionButton>
              </div>
            ))}
          </div>
        )}
      </section>
      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}
