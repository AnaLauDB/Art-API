import { getImageUrl } from "../services/arteServices";
import "../styles/ArtworkDetail.css";

export default function ArtworkDetail({ artwork, onClose }) {
    const imageUrl = artwork.image_id
        ? getImageUrl(artwork.image_id, "large")
        : null;

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Cerrar">
                    ✕
                </button>

                <div className="detail-content">
                    <div className="detail-image">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={artwork.title}
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <div className="detail-image-placeholder">
                                <span>📷</span>
                            </div>
                        )}
                    </div>

                    <div className="detail-info">
                        <h1>{artwork.title}</h1>

                        {artwork.artist_title && (
                            <div className="detail-item">
                                <strong>Artista:</strong>
                                <p>{artwork.artist_title}</p>
                            </div>
                        )}

                        {artwork.date_display && (
                            <div className="detail-item">
                                <strong>Fecha:</strong>
                                <p>{artwork.date_display}</p>
                            </div>
                        )}

                        {artwork.medium_display && (
                            <div className="detail-item">
                                <strong>Técnica/Material:</strong>
                                <p>{artwork.medium_display}</p>
                            </div>
                        )}

                        {artwork.dimensions && (
                            <div className="detail-item">
                                <strong>Dimensiones:</strong>
                                <p>{artwork.dimensions}</p>
                            </div>
                        )}

                        {artwork.description && (
                            <div className="detail-item">
                                <strong>Descripción:</strong>
                                <p>{artwork.description}</p>
                            </div>
                        )}

                        {artwork.credit_line && (
                            <div className="detail-item">
                                <strong>Crédito:</strong>
                                <p>{artwork.credit_line}</p>
                            </div>
                        )}

                        <div className="detail-actions">
                            <a
                                href={`https://www.artic.edu/artworks/${artwork.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-link"
                            >
                                Ver en el Art Institute →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
