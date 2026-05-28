import "../styles/ArtworkCard.css";
import { generateSrcSet, generateSizes } from "../services/imageServices";

export default function ArtworkCard({ artwork, onClick }) {
    // Obtener URL de imagen de Cleveland Art API
    const imageUrl = artwork.image_id;

    // Generar srcSet y sizes para responsive images
    const srcSet = generateSrcSet(imageUrl);
    const sizes = generateSizes();

    return (
        <div className="artwork-card" onClick={onClick}>
            <div className="artwork-image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        srcSet={srcSet}
                        sizes={sizes}
                        alt={artwork.title}
                        className="artwork-image"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="artwork-image-placeholder">
                        <span>No disponible</span>
                    </div>
                )}
                <div className="artwork-overlay">
                    <button className="view-btn">Ver detalles</button>
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
