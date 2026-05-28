import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDailyArtwork, setLoading, setError } from '../redux/slices/dailyPickSlice';
import { getTodayDateKey, isNewDay } from '../utils/dateUtils';
import { searchArtworks } from '../services/arteServices';
import '../styles/DailyArtwork.css';

/**
 * Componente DailyArtworkModal - Obra de arte sorpresa del día en modal
 * Muestra una obra aleatoria cada día al usuario logueado
 * La misma obra se muestra durante todo el día
 * Se guarda en localStorage con la fecha para persistencia
 * Se renderiza en un modal de 500-600px de ancho
 */
export default function DailyArtworkModal() {
    const dispatch = useDispatch();
    const { artwork, date, loading, error } = useSelector(state => state.dailyPick);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    /**
     * useEffect: Cargar obra del día
     * 1. Verificar si ya existe obra guardada en localStorage
     * 2. Si es el mismo día, mostrar obra guardada
     * 3. Si es nuevo día, seleccionar obra aleatoria nueva
     */
    useEffect(() => {
        const loadDailyArtwork = async () => {
            try {
                dispatch(setLoading(true));

                // Obtener fecha de hoy
                const todayKey = getTodayDateKey();

                // Intentar obtener obra guardada en localStorage
                const savedData = localStorage.getItem('art_daily_pick');

                if (savedData) {
                    const { artwork: savedArtwork, date: savedDate } = JSON.parse(savedData);

                    // Si es el mismo día y tenemos obra guardada, usarla
                    if (!isNewDay(savedDate) && savedArtwork) {
                        dispatch(setDailyArtwork({
                            artwork: savedArtwork,
                            date: savedDate
                        }));
                        setIsInitialized(true);
                        return;
                    }
                }

                // Es un nuevo día o no hay obra guardada: buscar obra aleatoria
                const randomPage = Math.floor(Math.random() * 50) + 1; // Páginas 1-50
                const response = await searchArtworks('art', 12, randomPage);

                if (response.data && response.data.length > 0) {
                    // Seleccionar obra aleatoria del primer resultado
                    const randomIndex = Math.floor(Math.random() * response.data.length);
                    const selectedArtwork = response.data[randomIndex];

                    // Guardar en localStorage
                    localStorage.setItem('art_daily_pick', JSON.stringify({
                        artwork: selectedArtwork,
                        date: todayKey
                    }));

                    // Actualizar Redux
                    dispatch(setDailyArtwork({
                        artwork: selectedArtwork,
                        date: todayKey
                    }));
                } else {
                    dispatch(setError('No se pudo obtener la obra del día'));
                }

                setIsInitialized(true);
            } catch (err) {
                console.error('Error loading daily artwork:', err);
                dispatch(setError('Error al cargar la obra del día'));
                setIsInitialized(true);
            }
        };

        if (!isInitialized) {
            loadDailyArtwork();
        }
    }, [dispatch, isInitialized]);

    // Si el modal está cerrado, no renderizar
    if (!isOpen) {
        return null;
    }

    // Mientras carga
    if (loading || !isInitialized) {
        return (
            <div className="daily-artwork-modal-overlay">
                <div className="daily-artwork-modal">
                    <button
                        className="daily-artwork-modal-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                    <p className="loading-text">Cargando tu obra del día...</p>
                </div>
            </div>
        );
    }

    // Si hay error
    if (error) {
        return (
            <div className="daily-artwork-modal-overlay">
                <div className="daily-artwork-modal">
                    <button
                        className="daily-artwork-modal-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                    <p className="error-text">{error}</p>
                </div>
            </div>
        );
    }

    // Si no hay obra
    if (!artwork) {
        return (
            <div className="daily-artwork-modal-overlay">
                <div className="daily-artwork-modal">
                    <button
                        className="daily-artwork-modal-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                    <p className="no-artwork-text">No se encontró obra del día</p>
                </div>
            </div>
        );
    }

    const imageUrl = artwork.image_id;

    return (
        <div className="daily-artwork-modal-overlay">
            <div className="daily-artwork-modal">
                <button
                    className="daily-artwork-modal-close"
                    onClick={() => setIsOpen(false)}
                >
                    ✕
                </button>

                <h2 className="daily-artwork-modal-title">Tu Obra del Día</h2>

                {/* Imagen */}
                <div className="daily-artwork-modal-image-wrapper">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={artwork.title}
                            className="daily-artwork-modal-image"
                            loading="eager"
                            decoding="async"
                        />
                    ) : (
                        <div className="daily-artwork-modal-image-placeholder">
                            <span>No disponible</span>
                        </div>
                    )}
                </div>

                {/* Información de la obra */}
                <div className="daily-artwork-modal-info">
                    <h3 className="daily-artwork-modal-work-title">{artwork.title}</h3>

                    {artwork.artist_title && (
                        <div className="daily-artwork-modal-detail">
                            <strong>Artista:</strong>
                            <span>{artwork.artist_title}</span>
                        </div>
                    )}

                    {artwork.date_display && (
                        <div className="daily-artwork-modal-detail">
                            <strong>Año:</strong>
                            <span>{artwork.date_display}</span>
                        </div>
                    )}

                    {artwork.technique && (
                        <div className="daily-artwork-modal-detail">
                            <strong>Técnica:</strong>
                            <span>{artwork.technique}</span>
                        </div>
                    )}

                    {artwork.culture && (
                        <div className="daily-artwork-modal-detail">
                            <strong>Cultura:</strong>
                            <span>{artwork.culture}</span>
                        </div>
                    )}

                    {artwork.type && (
                        <div className="daily-artwork-modal-detail">
                            <strong>Tipo:</strong>
                            <span>{artwork.type}</span>
                        </div>
                    )}

                    {date && (
                        <div className="daily-artwork-modal-date-note">
                            Actualizado: {date}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
