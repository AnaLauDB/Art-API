import { getCurrentUser } from './authServices';

const KEY_PREFIX = 'art_api_favorites_';

function _keyForUser(userId) {
    return `${KEY_PREFIX}${userId || 'anon'}`;
}

export function getFavorites(userId) {
    const key = _keyForUser(userId || getCurrentUser()?.id);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

export function saveFavorites(list, userId) {
    const key = _keyForUser(userId || getCurrentUser()?.id);
    localStorage.setItem(key, JSON.stringify(list));
}

export function isFavorite(artworkId, userId) {
    const favs = getFavorites(userId);
    return favs.some(a => String(a.id) === String(artworkId));
}

export function addFavorite(artwork, userId) {
    const favs = getFavorites(userId);
    if (!favs.some(a => String(a.id) === String(artwork.id))) {
        favs.unshift(artwork);
        saveFavorites(favs, userId);
    }
    return favs;
}

export function removeFavorite(artworkId, userId) {
    let favs = getFavorites(userId);
    favs = favs.filter(a => String(a.id) !== String(artworkId));
    saveFavorites(favs, userId);
    return favs;
}

export function toggleFavorite(artwork, userId) {
    if (!artwork) return getFavorites(userId);
    if (isFavorite(artwork.id, userId)) {
        return removeFavorite(artwork.id, userId);
    }
    return addFavorite(artwork, userId);
}
