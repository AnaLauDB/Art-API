import axios from "axios";

const API_BASE_URL = "https://api.artic.edu/api/v1";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "AIC-User-Agent": "art-search-engine (analog.lau@email.com)"
    }
});

/**
 * Buscar obras de arte por término de búsqueda
 * @param {string} q - Término de búsqueda
 * @param {number} limit - Límite de resultados
 * @param {number} page - Página de resultados
 * @returns {Promise} Resultados de búsqueda
 */
export const searchArtworks = async (q, limit = 12, page = 1) => {
    try {
        const response = await apiClient.get("/artworks/search", {
            params: {
                q,
                limit,
                page,
                fields: "id,title,image_id,artist_title,date_display,dimensions,medium_display,is_public_domain",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching artworks:", error);
        throw error;
    }
};

/**
 * Obtener obras por filtros avanzados
 * @param {object} filters - Filtros a aplicar
 * @returns {Promise} Resultados filtrados
 */
export const getArtworksByFilters = async (filters = {}) => {
    try {
        const params = {
            limit: filters.limit || 12,
            page: filters.page || 1,
            fields: "id,title,image_id,artist_title,date_display,dimensions,medium_display,is_public_domain",
        };

        // Usar término de búsqueda si existe
        if (filters.query) {
            params.q = filters.query;
        } else {
            params.q = "*"; // Búsqueda general si no hay filtros específicos
        }

        const response = await apiClient.get("/artworks/search", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered artworks:", error);
        throw error;
    }
};

/**
 * Obtener detalles de una obra específica
 * @param {number} id - ID de la obra
 * @returns {Promise} Detalles de la obra
 */
export const getArtworkDetails = async (id) => {
    try {
        const response = await apiClient.get(`/artworks/${id}`, {
            params: {
                fields: "id,title,image_id,artist_title,date_display,dimensions,medium_display,description,credit_line",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching artwork details:", error);
        throw error;
    }
};

/**
 * Obtener la URL de imagen de una obra
 * TEMPORALMENTE DESHABILITADO: Investigando problemas de CORS con IIIF Image API 2.0
 * @param {string} imageId - ID de imagen
 * @param {string} size - Tamaño de imagen (small, medium, large)
 * @returns {string} URL de imagen
 */
// export const getImageUrl = (imageId, size = "medium") => {
//     if (!imageId) return null;
//     // IIIF Image API sizes - use comma notation per official API docs
//     // See: https://api.artic.edu/docs/#iiif-image-api
//     const sizes = {
//         small: "200,",      // 200px width
//         medium: "400,",     // 400px width  
//         large: "843,",      // 843px width (recommended by ARTIC)
//     };
//     // Correct IIIF endpoint from official API documentation
//     return `https://www.artic.edu/iiif/2/${imageId}/full/${sizes[size]}/0/default.jpg`;
// };

/**
 * Obtener recomendaciones basadas en una obra
 * @param {number} id - ID de la obra de referencia
 * @returns {Promise} Obras similares
 */
export const getRecommendations = async (id) => {
    try {
        // Primero obtener detalles de la obra
        const artwork = await getArtworkDetails(id);

        // Buscar obras similares por artista o material
        const filters = {
            limit: 6,
            query: artwork.data.title,
        };

        if (artwork.data.artist_title) {
            filters.artist = artwork.data.artist_title;
        }

        return await getArtworksByFilters(filters);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};

/**
 * Obtener lista de artistas disponibles
 * @returns {Promise} Lista de artistas
 */
export const getArtists = async () => {
    try {
        const response = await apiClient.get("/agents", {
            params: {
                limit: 100,
                fields: "id,title",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error;
    }
};

/**
 * Obtener list de medios/técnicas
 * @returns {Promise} Lista de medios
 */
export const getMediums = async () => {
    try {
        // Obtener las categorías de medios desde las obras
        const response = await apiClient.get("/artworks/search", {
            params: {
                limit: 1,
                "query[exists][medium_display]": "true",
                aggs: "medium_display",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching mediums:", error);
        throw error;
    }
};

export default apiClient;