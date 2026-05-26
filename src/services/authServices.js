/**
 * authServices.js - Servicios de Autenticación
 * 
 * ¿Qué hace?
 * - Registrar nuevos usuarios
 * - Hacer login de usuarios existentes
 * - Hacer logout
 * - Validar credenciales
 * 
 * ¿Cómo funciona?
 * Usa localStorage como "base de datos" simulada
 * En producción esto se conectaría a un backend real
 * 
 * IMPORTANTE: NO guardes contraseñas así en producción
 * Esto es solo para aprendizaje
 */

const USERS_DB_KEY = 'art_api_users_database';
const AUTH_TOKEN_KEY = 'art_api_auth_token';
const CURRENT_USER_KEY = 'art_api_current_user';

/**
 * Obtener todos los usuarios (simulados en localStorage)
 */
function getAllUsers() {
    const data = localStorage.getItem(USERS_DB_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Guardar usuarios (simulados en localStorage)
 */
function saveUsers(users) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

/**
 * Registrar un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña (mínimo 6 caracteres)
 * @param {string} name - Nombre del usuario
 * @returns {Promise<{token: string, user: object}>}
 */
export const registerUser = async (email, password, name) => {
    // Simulamos una llamada async
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Validar que todos los campos estén presentes
            if (!email || !password || !name) {
                reject(new Error('Email, contraseña y nombre son requeridos'));
                return;
            }

            // Validar formato del email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                reject(new Error('El email no es válido'));
                return;
            }

            // Validar longitud de contraseña
            if (password.length < 6) {
                reject(new Error('La contraseña debe tener al menos 6 caracteres'));
                return;
            }

            // Obtener usuarios existentes
            const users = getAllUsers();

            // Verificar si el email ya existe
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                reject(new Error('Este email ya está registrado'));
                return;
            }

            // Crear nuevo usuario
            const newUser = {
                id: Date.now().toString(),
                email,
                password, // ⚠️ SOLO PARA APRENDIZAJE - Nunca guardes así en producción
                name,
                createdAt: new Date().toISOString(),
            };

            // Guardar usuario en "base de datos"
            users.push(newUser);
            saveUsers(users);

            // Guardar token en localStorage
            const token = `token_${newUser.id}_${Date.now()}`;
            localStorage.setItem(AUTH_TOKEN_KEY, token);

            // Guardar usuario actual
            const userToReturn = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));

            // Resolver con éxito
            resolve({
                token,
                user: userToReturn,
            });
        }, 500); // Simular latencia de red
    });
};

/**
 * Hacer login de un usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!email || !password) {
                reject(new Error('Email y contraseña son requeridos'));
                return;
            }

            const users = getAllUsers();

            // Buscar usuario por email y contraseña
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                reject(new Error('Email o contraseña incorrectos'));
                return;
            }

            // Generar token
            const token = `token_${user.id}_${Date.now()}`;
            localStorage.setItem(AUTH_TOKEN_KEY, token);

            // Guardar usuario actual
            const userToReturn = {
                id: user.id,
                email: user.email,
                name: user.name,
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));

            resolve({
                token,
                user: userToReturn,
            });
        }, 500);
    });
};

/**
 * Hacer logout
 */
export const logoutUser = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Obtener usuario actual desde localStorage
 * Útil para verificar sesión persistente
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!userStr || !token) {
        return null;
    }

    return JSON.parse(userStr);
};

/**
 * Obtener token actual
 */
export const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Verificar si usuario está autenticado
 */
export const isAuthenticated = () => {
    return !!getToken() && !!getCurrentUser();
};
