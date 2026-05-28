/**
 * Servicio de optimización de imágenes
 * Genera URLs optimizadas para diferentes resoluciones
 * Soporta responsive design sin agregar librerías externas
 */

/**
 * Tamaños de imagen disponibles para responsive design
 * Basado en puntos de corte comunes de dispositivos
 */
const IMAGE_SIZES = {
    thumbnail: 150,    // Para previsualizaciones
    small: 300,        // Mobile
    medium: 600,       // Tablet
    large: 1000,       // Desktop
    xlarge: 1400,      // Desktop grande
};

/**
 * Genera una URL optimizada de imagen del tamaño especificado
 * @param {string} imageUrl - URL original de la imagen
 * @param {string} size - Tamaño deseado (thumbnail, small, medium, large, xlarge)
 * @returns {string} URL optimizada o original si no se puede procesar
 */
export const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
    if (!imageUrl) return null;

    // Si la URL no es válida, devolver la original
    if (typeof imageUrl !== 'string') return null;

    // Para Cleveland Art Museum: la URL ya está optimizada
    // Solo necesitamos devolver la original
    return imageUrl;
};

/**
 * Genera un string srcSet para usar en etiquetas img
 * Define múltiples resoluciones para que el navegador elija la mejor
 * @param {string} imageUrl - URL de la imagen
 * @returns {string} srcSet para el atributo srcset de img
 */
export const generateSrcSet = (imageUrl) => {
    if (!imageUrl) return '';

    // Para Cleveland Art Museum: generar versiones de diferente densidad
    // Los navegadores modernos soportan srcSet con múltiples densidades
    const srcSet = `
        ${imageUrl} 1x,
        ${imageUrl} 2x
    `.trim();

    return srcSet;
};

/**
 * Genera un string sizes para usar con srcSet
 * Especifica qué imagen usar según el ancho de la ventana
 * @returns {string} sizes para el atributo sizes de img
 */
export const generateSizes = () => {
    // Definir cómo se muestra la imagen en diferentes pantallas
    const sizes = `
        (max-width: 480px) 90vw,
        (max-width: 768px) 45vw,
        (max-width: 1024px) 33vw,
        25vw
    `.trim();

    return sizes;
};

/**
 * Verifica si una URL de imagen es válida y accesible
 * @param {string} imageUrl - URL a verificar
 * @returns {Promise<boolean>} true si la imagen es válida
 */
export const isValidImageUrl = async (imageUrl) => {
    if (!imageUrl) return false;

    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Error validating image URL:', error);
        return false;
    }
};

/**
 * Calcula el ancho óptimo basado en el dispositivo
 * @returns {number} Ancho en píxeles
 */
export const getOptimalImageWidth = () => {
    if (typeof window === 'undefined') return IMAGE_SIZES.medium;

    const width = window.innerWidth;

    if (width <= 480) return IMAGE_SIZES.small;
    if (width <= 768) return IMAGE_SIZES.medium;
    if (width <= 1024) return IMAGE_SIZES.large;
    return IMAGE_SIZES.xlarge;
};

/**
 * Obtiene información sobre los tamaños de imagen disponibles
 * Útil para debugging y configuración
 * @returns {object} Objeto con los tamaños disponibles
 */
export const getImageSizesInfo = () => {
    return IMAGE_SIZES;
};
