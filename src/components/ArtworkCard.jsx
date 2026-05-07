import "../styles/ArtworkCard.css";

export default function ArtworkCard({ artwork, onClick }) {
    // Nota: Carga de imágenes temporalmente deshabilitada
    // Se investigará solución de CORS con IIIF Image API 2.0

    return (
        <div className="artwork-card" onClick={onClick}>
            <div className="artwork-image-container">
                <div className="artwork-image-placeholder">
                    <span>🖼️</span>
                </div>
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
