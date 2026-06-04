import axios from "axios";

// Nueva API: Cleveland Art Museum (mejor soporte para imágenes)
const API_BASE_URL = "https://openaccess-api.clevelandart.org/api";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

/**
 * Buscar obras de arte por término de búsqueda
 * Usa Cleveland Art Museum API
 * @param {string} q - Término de búsqueda
 * @param {number} limit - Límite de resultados
 * @param {number} page - Página de resultados
 * @returns {Promise} Resultados de búsqueda
 */
export const searchArtworks = async (q, limit = 12, page = 1) => {
    try {
        // Calcular offset (Cleveland API usa skip/limit)
        const skip = (page - 1) * limit;
        // Hacemos hasta 3 intentos avanzando página si no hay resultados con imagen
        let attempt = 0;
        let currentPage = page;
        let response = null;
        let mappedData = [];

        while (attempt < 3) {
            const currentSkip = (currentPage - 1) * limit;
            response = await apiClient.get("/artworks", {
                params: {
                    q,
                    limit,
                    skip: currentSkip,
                },
            });

            mappedData = (response.data.data || []).map((artwork) => ({
                id: artwork.id,
                title: artwork.title || "Sin título",
                artist_title: artwork.creators && artwork.creators[0]
                    ? artwork.creators[0].description
                    : "Artista desconocido",
                date_display: artwork.creation_date || artwork.date_end || "Fecha desconocida",
                medium_display: artwork.technique || "Técnica desconocida",
                image_id: artwork.images?.web?.url || null,
                is_public_domain: true,
                culture: artwork.culture,
                type: artwork.type,
                department: artwork.department,
                technique: artwork.technique,
            })).filter(artwork => artwork.image_id);

            if (mappedData.length > 0) break;

            // Avanzar a la siguiente página y reintentar
            currentPage += 1;
            attempt += 1;
            // Si sobrepasamos el total de páginas, salimos
            const total = response.data.info?.total || 0;
            const totalPages = Math.ceil(total / limit) || 1;
            if (currentPage > totalPages) break;
        }

        return {
            data: mappedData,
            pagination: {
                total_pages: Math.ceil((response?.data?.info?.total || 0) / limit),
                total: response?.data?.info?.total || 0,
                page: currentPage,
            },
        };
    } catch (error) {
        console.error("Error searching artworks:", error);
        throw error;
    }
};

/**
 * Obtener obras por filtros avanzados
 * Soporta: culture, type, creation_date, department, technique
 * @param {object} filters - Filtros a aplicar
 * @returns {Promise} Resultados filtrados
 */
export const getArtworksByFilters = async (filters = {}) => {
    try {
        const limit = filters.limit || 12;
        let currentPage = filters.page || 1;
        let attempt = 0;

        const paramsBase = {
            limit,
        };

        let response = null;
        let mappedData = [];

        while (attempt < 3) {
            const skip = (currentPage - 1) * limit;
            const params = { ...paramsBase, skip };

            if (filters.query) params.q = filters.query;
            if (filters.culture) params.culture = filters.culture;
            if (filters.type) params.type = filters.type;
            if (filters.department) params.department = filters.department;
            if (filters.technique) params.technique = filters.technique;
            if (filters.creation_date) params.creation_date = filters.creation_date;

            response = await apiClient.get("/artworks", { params });

            mappedData = (response.data.data || []).map((artwork) => ({
                id: artwork.id,
                title: artwork.title || "Sin título",
                artist_title: artwork.creators && artwork.creators[0]
                    ? artwork.creators[0].description
                    : "Artista desconocido",
                date_display: artwork.creation_date || artwork.date_end || "Fecha desconocida",
                medium_display: artwork.technique || "Técnica desconocida",
                image_id: artwork.images?.web?.url || null,
                is_public_domain: true,
                culture: artwork.culture,
                type: artwork.type,
                department: artwork.department,
                technique: artwork.technique,
            })).filter(artwork => artwork.image_id);

            if (mappedData.length > 0) break;

            currentPage += 1;
            attempt += 1;
            const total = response.data.info?.total || 0;
            const totalPages = Math.ceil(total / limit) || 1;
            if (currentPage > totalPages) break;
        }

        return {
            data: mappedData,
            pagination: {
                total_pages: Math.ceil((response?.data?.info?.total || 0) / limit),
                total: response?.data?.info?.total || 0,
                page: currentPage,
            },
        };
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
        const response = await apiClient.get(`/artworks/${id}`);
        const artwork = response.data.data;

        return {
            data: {
                id: artwork.id,
                title: artwork.title || "Sin título",
                artist_title: artwork.creators && artwork.creators[0]
                    ? artwork.creators[0].description
                    : "Artista desconocido",
                date_display: artwork.creation_date || artwork.date_end || "Fecha desconocida",
                medium_display: artwork.technique || "Técnica desconocida",
                image_id: artwork.images?.web?.url || null,
                description: artwork.description,
                credit_line: artwork.creditline,
                culture: artwork.culture,
                type: artwork.type,
                department: artwork.department,
                technique: artwork.technique,
            },
        };
    } catch (error) {
        console.error("Error fetching artwork details:", error);
        throw error;
    }
};

/**
 * Obtener la URL de imagen de una obra
 * Cleveland Art API ya proporciona URLs directas en images.web.url
 * Este helper se mantiene por compatibilidad futura
 * @param {string} imageUrl - URL de imagen
 * @returns {string} URL de imagen
 */
export const getImageUrl = (imageUrl) => {
    return imageUrl || null;
};

/**
 * Obtener recomendaciones basadas en una obra
 * NOTA: Simplificado para Cleveland API
 * @param {number} id - ID de la obra de referencia
 * @returns {Promise} Obras similares
 */
export const getRecommendations = async (id) => {
    try {
        // Obtener la obra original
        const artwork = await getArtworkDetails(id);

        // Buscar obras similares por departamento o técnica
        const filters = {
            limit: 6,
            page: 1,
        };

        if (artwork.data.department) {
            filters.department = artwork.data.department;
        }

        return await getArtworksByFilters(filters);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};

/**
 * Obtener lista de artistas disponibles
 * NOTA: Cleveland API no tiene endpoint de artistas, retorna array vacío
 * Esta función se mantiene por compatibilidad
 * @returns {Promise} Lista de artistas (vacía para Cleveland API)
 */
export const getArtists = async () => {
    try {
        // Cleveland API no tiene endpoint dedicated para artistas
        // Retornamos array vacío por compatibilidad
        return [];
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