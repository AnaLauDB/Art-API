/**
 * Servicio de optimización y validación de imágenes
 * Sin HEAD requests. Valida la carga real de la imagen con Image().
 */

const IMAGE_SIZES = {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1000,
    xlarge: 1400,
};

// Cache simple para no validar la misma URL más de una vez
const imageValidationCache = new Map();

/**
 * Genera una URL optimizada de imagen del tamaño especificado
 * Cleveland Open Access ya entrega URLs directas.
 * @param {string} imageUrl - URL original de la imagen
 * @param {string} size - Tamaño deseado
 * @returns {string|null}
 */
export const getOptimizedImageUrl = (imageUrl, size = "medium") => {
    if (!imageUrl || typeof imageUrl !== "string") return null;
    return imageUrl;
};

/**
 * Genera srcSet simple para compatibilidad.
 * En esta API la misma URL se usa para todos los densities.
 * @param {string} imageUrl
 * @returns {string}
 */
export const generateSrcSet = (imageUrl) => {
    if (!imageUrl) return "";
    return `${imageUrl} 1x, ${imageUrl} 2x`;
};

/**
 * Genera sizes para responsive images
 * @returns {string}
 */
export const generateSizes = () => {
    return `
        (max-width: 480px) 90vw,
        (max-width: 768px) 45vw,
        (max-width: 1024px) 33vw,
        25vw
    `.trim();
};

/**
 * Verifica si una URL de imagen realmente puede cargarse.
 * No usa HEAD. Usa carga real de imagen.
 * @param {string} imageUrl
 * @returns {Promise<boolean>}
 */
export const isValidImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") {
        return Promise.resolve(false);
    }

    if (imageValidationCache.has(imageUrl)) {
        return Promise.resolve(imageValidationCache.get(imageUrl));
    }

    return new Promise((resolve) => {
        const img = new Image();
        let settled = false;

        const finish = (result) => {
            if (settled) return;
            settled = true;
            imageValidationCache.set(imageUrl, result);
            resolve(result);
        };

        const timeout = setTimeout(() => finish(false), 8000);

        img.onload = () => {
            clearTimeout(timeout);
            finish(true);
        };

        img.onerror = () => {
            clearTimeout(timeout);
            finish(false);
        };

        img.src = imageUrl;
    });
};

/**
 * Calcula el ancho óptimo basado en el dispositivo
 * @returns {number}
 */
export const getOptimalImageWidth = () => {
    if (typeof window === "undefined") return IMAGE_SIZES.medium;

    const width = window.innerWidth;

    if (width <= 480) return IMAGE_SIZES.small;
    if (width <= 768) return IMAGE_SIZES.medium;
    if (width <= 1024) return IMAGE_SIZES.large;
    return IMAGE_SIZES.xlarge;
};

/**
 * Obtiene información sobre tamaños de imagen
 * @returns {object}
 */
export const getImageSizesInfo = () => {
    return IMAGE_SIZES;
};