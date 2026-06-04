import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFavorites, removeFavorite } from '../services/favoritesService';
import ArtworkCard from './ArtworkCard';
import { setProfileVisible } from '../redux/slices/uiSlice';
import { setCurrentPage, searchArtworksAsync } from '../redux/slices/artworksSlice';
import { getAvatar, setAvatar } from '../services/avatarService';

// Lista actual de assets disponibles (se puede actualizar cuando añadas más imágenes a src/assets)
const AVAILABLE_ASSETS = [
    '/src/assets/icons_users/boy1.png',
    '/src/assets/icons_users/girl1.png',
    '/src/assets/icons_users/boy2.png',
    '/src/assets/icons_users/girl2.png',
    '/src/assets/icons_users/boy3.png',
    '/src/assets/icons_users/girl3.png',
    '/src/assets/icons_users/boy4.png',
    '/src/assets/icons_users/girl4.png',
    '/src/assets/icons_users/boy5.png',
    '/src/assets/icons_users/girl5.png',
];

export default function UserProfile() {
    const dispatch = useDispatch();
    const user = useSelector(s => s.auth.user);
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);
    const [favorites, setFavorites] = useState([]);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [description, setDescription] = useState('');
    const [hobbiesText, setHobbiesText] = useState('');

    useEffect(() => {
        const list = getFavorites(user?.id);
        setFavorites(list);
        const avatar = getAvatar(user?.id);
        setCurrentAvatar(avatar);

        // cargar perfil (descripción + hobbies)
        import('../services/profileService').then(mod => {
            const p = mod.getProfile(user?.id);
            setDescription(p.description || '');
            setHobbiesText((p.hobbies || []).join(', '));
        }).catch(() => { });
    }, [user]);

    const handleBack = () => {
        // Ocultar vista de perfil y volver a la galería en página 1
        dispatch(setProfileVisible(false));
        dispatch(setCurrentPage(1));
        dispatch(searchArtworksAsync({ query: 'art', limit: 12, page: 1 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemove = (id) => {
        removeFavorite(id, user?.id);
        setFavorites(getFavorites(user?.id));
    };

    const handleSelectAvatar = (assetPath) => {
        // solo actualizamos el estado local; persistimos al guardar
        setCurrentAvatar(assetPath);
    };

    const handleSaveProfile = async () => {
        const hobbies = hobbiesText.split(',').map(s => s.trim()).filter(Boolean);
        const mod = await import('../services/profileService');
        mod.saveProfile(user?.id, { description, hobbies });
        // persistir avatar seleccionado cuando se guarda el perfil
        if (currentAvatar) setAvatar(user?.id, currentAvatar);
        alert('Perfil guardado.');
    };

    if (!isLoggedIn || !user) return null;

    return (
        <div className="profile-page" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Perfil de {user.name}</h2>
                <button onClick={handleBack}>Volver</button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                <div style={{ minWidth: 200 }}>
                    <div className="avatar-preview">
                        {currentAvatar ? (
                            <img src={currentAvatar} alt="Avatar" style={{ width: 180, height: 180, objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>No avatar</div>
                        )}

                        <h4 style={{ marginTop: '12px' }}>{user.email?.split('@')[0]}</h4>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <h4>Seleccionar avatar</h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {AVAILABLE_ASSETS.map(a => (
                                <button key={a} onClick={() => handleSelectAvatar(a)} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                                    <img src={a} alt={a} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <section>
                        <h3>Acerca de mí</h3>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Escribe una breve descripción sobre ti y tu interés en el arte" style={{ width: '100%', minHeight: 120 }} />
                    </section>

                    <section style={{ marginTop: '12px' }}>
                        <h3>Pasatiempos / intereses (separados por coma)</h3>
                        <input type="text" value={hobbiesText} onChange={e => setHobbiesText(e.target.value)} style={{ width: '100%' }} placeholder="ej: pintura, acuarela, historia del arte" />
                    </section>

                    <div style={{ marginTop: '12px' }}>
                        <button onClick={handleSaveProfile}>Guardar perfil</button>
                    </div>

                    <section style={{ marginTop: '24px' }}>
                        <h3>Obras favoritas ({favorites.length})</h3>
                        {favorites.length === 0 ? (
                            <p>No tienes obras favoritas aún.</p>
                        ) : (
                            <div className="favorites-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' }}>
                                {favorites.map(a => (
                                    <div key={a.id} className="favorite-item">
                                        <ArtworkCard artwork={a} onClick={() => { }} />
                                        <button onClick={() => handleRemove(a.id)}>Quitar</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
