import styles from "../styles/ArtworkCard.module.css";
import { generateSrcSet, generateSizes } from "../services/imageServices";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "../services/favoritesService";
import favoriteIcon from "../assets/iconos/favorite.svg";
import shareIcon from "../assets/iconos/share.svg";
import ArtworkActionButton from "./ArtworkActionButton";

const PLACEHOLDER = "/src/assets/hero.png";

export default function ArtworkCard({ artwork, onClick, onImageError }) {
  const imageUrl = artwork.image_id;
  const srcSet = imageUrl ? generateSrcSet(imageUrl) : "";
  const sizes = generateSizes();

  const [fav, setFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl || PLACEHOLDER);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    setFav(isFavorite(artwork.id));
  }, [artwork.id]);

  useEffect(() => {
    setImgSrc(imageUrl || PLACEHOLDER);
    setHadError(false);
  }, [imageUrl]);

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite({
      ...artwork,
    });
    setFav((prev) => !prev);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?artwork=${artwork.id}`;
    const text = `${artwork.title} — ${artwork.artist_title || "Artista desconocido"}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: artwork.title, text, url: shareUrl });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Enlace copiado al portapapeles.");
      } else {
        window.prompt("Copia el enlace:", shareUrl);
      }
    } catch (err) {
      console.error("Error compartiendo:", err);
      alert("No se pudo compartir.");
    }
  };

  const handleImgError = (e) => {
    if (!hadError) {
      setHadError(true);
      setImgSrc(PLACEHOLDER);
      if (typeof onImageError === "function") onImageError(artwork.id);
    }
  };

  return (
    <div className={styles["artwork-card"]} onClick={onClick}>
      <div className={styles["artwork-image-container"]}>
        {imgSrc ? (
          <img
            src={imgSrc}
            srcSet={hadError ? "" : srcSet}
            sizes={sizes}
            alt={artwork.title}
            className={styles["artwork-image"]}
            loading="lazy"
            decoding="async"
            onError={handleImgError}
          />
        ) : (
          <div className={styles["artwork-image-placeholder"]}>
            <span>No disponible</span>
          </div>
        )}
      </div>

      <div className={styles["artwork-overlay"]}>
        <div className={styles["view-btn"]}>
          <div className={styles["view-btn"]}>
            <ArtworkActionButton
              variant="favorite"
              data-tip={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={handleToggleFav}
            >
              <img src={favoriteIcon} alt="Favorito" />
            </ArtworkActionButton>

            <ArtworkActionButton
              variant="share"
              data-tip="Compartir obra"
              onClick={handleShare}
            >
              <img src={shareIcon} alt="Compartir" />
            </ArtworkActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
