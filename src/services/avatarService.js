const AVATAR_KEY_PREFIX = 'art_api_avatar_';

function _key(userId) {
    return `${AVATAR_KEY_PREFIX}${userId || 'anon'}`;
}

export function getAvatar(userId) {
    const key = _key(userId);
    return localStorage.getItem(key) || null;
}

export function setAvatar(userId, avatarPath) {
    const key = _key(userId);
    if (avatarPath) {
        localStorage.setItem(key, avatarPath);
    } else {
        localStorage.removeItem(key);
    }
}

export default { getAvatar, setAvatar };
