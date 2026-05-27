import ArtworkCard from "./ArtworkCard";
import "../styles/ArtworkGrid.css";

export default function ArtworkGrid({ artworks, onArtworkClick, isLoading }) {
    if (isLoading) {
        return (
            <div className="gallery-loading">
                <div className="loading-spinner"></div>
                <p>Cargando obras de arte...</p>
            </div>
        );
    }

    if (!artworks || artworks.length === 0) {
        return (
            <div className="gallery-empty">
                <p> No se encontraron obras de arte</p>
                <small>Intenta con otros términos de búsqueda</small>
            </div>
        );
    }

    return (
        <div className="artwork-grid">
            {artworks.map((artwork) => (
                <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => onArtworkClick(artwork)}
                />
            ))}
        </div>
    );
}
