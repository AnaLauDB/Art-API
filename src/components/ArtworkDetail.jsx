import styles from "../styles/ArtworkDetail.module.css";

const PLACEHOLDER = '/src/assets/hero.png';

export default function ArtworkDetail({ artwork, onClose }) {
    const imageSrc = artwork.image_id || PLACEHOLDER;

    return (
        <div className={styles['detail-modal-overlay']} onClick={onClose}>
            <div className={styles['detail-modal']} onClick={(e) => e.stopPropagation()}>
                <button className={styles['close-btn']} onClick={onClose} aria-label="Cerrar">
                    ✕
                </button>

                <div className={styles['detail-content']}>
                    <div className={styles['detail-image']}>
                        {imageSrc ? (
                            <img src={imageSrc} alt={artwork.title} />
                        ) : (
                            <div className={styles['detail-image-placeholder']}>
                                <span>🖼️</span>
                            </div>
                        )}
                    </div>

                    <div className={styles['detail-info']}>
                        <h1>{artwork.title}</h1>

                        {artwork.artist_title && (
                            <div className={styles['detail-item']}>
                                <strong>Artista:</strong>
                                <p>{artwork.artist_title}</p>
                            </div>
                        )}

                        {artwork.date_display && (
                            <div className={styles['detail-item']}>
                                <strong>Fecha:</strong>
                                <p>{artwork.date_display}</p>
                            </div>
                        )}

                        {artwork.medium_display && (
                            <div className={styles['detail-item']}>
                                <strong>Técnica/Material:</strong>
                                <p>{artwork.medium_display}</p>
                            </div>
                        )}

                        {artwork.dimensions && (
                            <div className={styles['detail-item']}>
                                <strong>Dimensiones:</strong>
                                <p>{artwork.dimensions}</p>
                            </div>
                        )}

                        {artwork.culture && (
                            <div className={styles['detail-item']}>
                                <strong>Cultura:</strong>
                                <p>{artwork.culture}</p>
                            </div>
                        )}

                        {artwork.description && (
                            <div className={styles['detail-item']}>
                                <strong>Descripción:</strong>
                                <p>{artwork.description}</p>
                            </div>
                        )}

                        {artwork.credit_line && (
                            <div className={styles['detail-item']}>
                                <strong>Crédito:</strong>
                                <p>{artwork.credit_line}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
