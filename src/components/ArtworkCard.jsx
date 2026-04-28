import { useState } from "react";
import { getImageUrl } from "../services/arteServices";
import "../styles/ArtworkCard.css";

export default function ArtworkCard({ artwork, onClick }) {
    const [imageError, setImageError] = useState(false);

    const imageUrl = artwork.image_id
        ? getImageUrl(artwork.image_id, "medium")
        : null;

    return (
        <div className="artwork-card" onClick={onClick}>
            <div className="artwork-image-container">
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={artwork.title}
                        className="artwork-image"
                        onError={() => setImageError(true)}
                        loading="lazy"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="artwork-image-placeholder">
                        <span>📷</span>
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
            </div>
        </div>
    );
}
