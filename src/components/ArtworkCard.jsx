import "../styles/ArtworkCard.css";
import { generateSrcSet, generateSizes } from "../services/imageServices";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "../services/favoritesService";

const PLACEHOLDER = '/src/assets/hero.png';

export default function ArtworkCard({ artwork, onClick, onImageError }) {
    const imageUrl = artwork.image_id;
    const srcSet = imageUrl ? generateSrcSet(imageUrl) : '';
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
        toggleFavorite(
            {
                id: artwork.id,
                title: artwork.title,
                image_id: artwork.image_id,
                artist_title: artwork.artist_title,
            }
        );
        setFav(prev => !prev);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}${window.location.pathname}?artwork=${artwork.id}`;
        const text = `${artwork.title} — ${artwork.artist_title || 'Artista desconocido'}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: artwork.title, text, url: shareUrl });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                alert('Enlace copiado al portapapeles.');
            } else {
                window.prompt('Copia el enlace:', shareUrl);
            }
        } catch (err) {
            console.error('Error compartiendo:', err);
            alert('No se pudo compartir.');
        }
    };

    const handleImgError = (e) => {
        if (!hadError) {
            setHadError(true);
            setImgSrc(PLACEHOLDER);
            // Notify parent grid that an image failed to load
            if (typeof onImageError === 'function') onImageError(artwork.id);
        }
    };

    return (
        <div className="artwork-card" onClick={onClick}>
            <div className="artwork-image-container">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        srcSet={hadError ? '' : srcSet}
                        sizes={sizes}
                        alt={artwork.title}
                        className="artwork-image"
                        loading="lazy"
                        decoding="async"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="artwork-image-placeholder">
                        <span>No disponible</span>
                    </div>
                )}

                <div className="artwork-overlay">
                    <button className="view-btn">Ver detalles</button>
                    <div className="artwork-actions">
                        <button
                            className={`fav-btn ${fav ? 'fav-active' : ''}`}
                            aria-pressed={fav}
                            onClick={handleToggleFav}
                            title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            {fav ? '♥' : '♡'}
                        </button>
                        <button className="share-btn" onClick={handleShare} title="Compartir">
                            ↗
                        </button>
                    </div>
                </div>
            </div>

            <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                {artwork.artist_title && (
                    <p className="artwork-artist">{artwork.artist_title}</p>
                )}
                {artwork.date_display && (
                    <p className="artwork-date">{artwork.date_display}</p>
                )}
                {artwork.technique && (
                    <p className="artwork-technique">{artwork.technique}</p>
                )}
            </div>
        </div>
    );
}
