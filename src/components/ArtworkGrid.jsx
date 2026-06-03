import ArtworkCard from "./ArtworkCard";
import styles from "../styles/ArtworkGrid.module.css";
import { useState } from "react";

const MAX_VISIBLE = 6;

export default function ArtworkGrid({ artworks, onArtworkClick, isLoading }) {
    if (isLoading) {
        return (
            <div className={styles['gallery-loading']}>
                <div className={styles['loading-spinner']}></div>
                <p>Cargando obras de arte...</p>
            </div>
        );
    }

    if (!artworks || artworks.length === 0) {
        return (
            <div className={styles['gallery-empty']}>
                <p> No se encontraron obras de arte</p>
                <small>Intenta con otros términos de búsqueda</small>
            </div>
        );
    }

    const [failedImages, setFailedImages] = useState([]);

    const handleImageError = (id) => {
        setFailedImages(prev => (prev.includes(id) ? prev : [...prev, id]));
    };

    const visible = artworks.slice(0, MAX_VISIBLE);

    return (
        <div>
            {failedImages.length > 0 && (
                <div className="image-warning" style={{ padding: '8px 12px', background: '#fff4e5', border: '1px solid #ffd8a8', borderRadius: 6, marginBottom: 12 }}>
                    Algunas imágenes no se pudieron cargar. Si el problema persiste, intenta recargar la página o probar otra búsqueda.
                </div>
            )}

            <div className={styles['artwork-grid']}>
                {visible.map((artwork) => (
                    <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        onClick={() => onArtworkClick(artwork)}
                        onImageError={handleImageError}
                    />
                ))}
            </div>
        </div>
    );
}
