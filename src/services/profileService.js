const PROFILE_KEY_PREFIX = 'art_api_profile_';

function _key(userId) {
    return `${PROFILE_KEY_PREFIX}${userId || 'anon'}`;
}

export function getProfile(userId) {
    const raw = localStorage.getItem(_key(userId));
    if (!raw) return { description: '', hobbies: [] };
    try {
        return JSON.parse(raw);
    } catch (e) {
        return { description: '', hobbies: [] };
    }
}

export function saveProfile(userId, profile) {
    localStorage.setItem(_key(userId), JSON.stringify(profile));
}

export default { getProfile, saveProfile };
