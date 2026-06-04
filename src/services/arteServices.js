import axios from "axios";
import { isValidImageUrl } from "./imageServices";

// Cleveland Art Museum API
const API_BASE_URL = "https://openaccess-api.clevelandart.org/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

const dedupe = (arr) => [...new Set(arr.filter(Boolean))];

const getArtworkImageCandidates = (artwork) => {
    return dedupe([
        artwork?.images?.web?.url,
        artwork?.images?.print?.url,
        artwork?.images?.full?.url,
    ]);
};

const mapArtwork = (artwork, imageUrl) => ({
    id: artwork.id,
    title: artwork.title || "Sin título",
    artist_title:
        artwork.creators && artwork.creators[0]
            ? artwork.creators[0].description
            : "Artista desconocido",
    date_display:
        artwork.creation_date || artwork.date_end || "Fecha desconocida",
    medium_display: artwork.technique || "Técnica desconocida",
    image_id: imageUrl || null, // se conserva el nombre por compatibilidad
    image_url: imageUrl || null, // nombre más claro para usar en nuevos componentes
    is_public_domain: true,
    culture: artwork.culture,
    type: artwork.type,
    department: artwork.department,
    technique: artwork.technique,
});

const resolveValidImageUrl = async (artwork) => {
    const candidates = getArtworkImageCandidates(artwork);

    for (const candidate of candidates) {
        const valid = await isValidImageUrl(candidate);
        if (valid) return candidate;
    }

    return null;
};

const validateAndMapArtworks = async (rawArtworks, requiredCount) => {
    const validated = await Promise.all(
        (rawArtworks || []).map(async (artwork) => {
            const validImageUrl = await resolveValidImageUrl(artwork);
            if (!validImageUrl) return null;
            return mapArtwork(artwork, validImageUrl);
        })
    );

    return validated.filter(Boolean).slice(0, requiredCount);
};

const fetchValidArtworksPage = async ({
    params,
    limit,
    page,
    maxAttempts = 5,
}) => {
    const fetchLimit = Math.max(limit * 3, 30);
    const validArtworks = [];
    let currentPage = page;
    let attempts = 0;
    let total = 0;

    while (validArtworks.length < limit && attempts < maxAttempts) {
        const skip = (currentPage - 1) * fetchLimit;

        const response = await apiClient.get("/artworks", {
            params: {
                ...params,
                limit: fetchLimit,
                skip,
            },
        });

        const rawArtworks = response.data.data || [];
        total = response.data.info?.total || total;

        const remaining = limit - validArtworks.length;
        const validatedBatch = await validateAndMapArtworks(
            rawArtworks,
            remaining
        );

        validArtworks.push(...validatedBatch);

        const totalPages = Math.ceil(total / fetchLimit) || 1;

        if (!rawArtworks.length || currentPage >= totalPages) {
            break;
        }

        currentPage += 1;
        attempts += 1;
    }

    return {
        data: validArtworks.slice(0, limit),
        pagination: {
            total_pages: Math.ceil(total / limit) || 1,
            total,
            page,
        },
    };
};

/**
 * Buscar obras por término de búsqueda
 * @param {string} q
 * @param {number} limit
 * @param {number} page
 * @returns {Promise}
 */
export const searchArtworks = async (q, limit = 12, page = 1) => {
    try {
        return await fetchValidArtworksPage({
            params: { q },
            limit,
            page,
        });
    } catch (error) {
        console.error("Error searching artworks:", error);
        throw error;
    }
};

/**
 * Obtener obras por filtros avanzados
 * @param {object} filters
 * @returns {Promise}
 */
export const getArtworksByFilters = async (filters = {}) => {
    try {
        const limit = filters.limit || 12;
        const page = filters.page || 1;

        const params = {};

        if (filters.query) params.q = filters.query;
        if (filters.culture) params.culture = filters.culture;
        if (filters.type) params.type = filters.type;
        if (filters.department) params.department = filters.department;
        if (filters.technique) params.technique = filters.technique;
        if (filters.creation_date) params.creation_date = filters.creation_date;

        return await fetchValidArtworksPage({
            params,
            limit,
            page,
        });
    } catch (error) {
        console.error("Error fetching filtered artworks:", error);
        throw error;
    }
};

/**
 * Obtener detalles de una obra específica
 * @param {number} id
 * @returns {Promise}
 */
export const getArtworkDetails = async (id) => {
    try {
        const response = await apiClient.get(`/artworks/${id}`);
        const artwork = response.data.data;

        const validImageUrl = await resolveValidImageUrl(artwork);

        return {
            data: {
                id: artwork.id,
                title: artwork.title || "Sin título",
                artist_title:
                    artwork.creators && artwork.creators[0]
                        ? artwork.creators[0].description
                        : "Artista desconocido",
                date_display:
                    artwork.creation_date ||
                    artwork.date_end ||
                    "Fecha desconocida",
                medium_display: artwork.technique || "Técnica desconocida",
                image_id: validImageUrl || null,
                image_url: validImageUrl || null,
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
 * Helper por compatibilidad
 * @param {string} imageUrl
 * @returns {string|null}
 */
export const getImageUrl = (imageUrl) => {
    return imageUrl || null;
};

/**
 * Recomendaciones basadas en una obra
 * @param {number} id
 * @returns {Promise}
 */
export const getRecommendations = async (id) => {
    try {
        const artwork = await getArtworkDetails(id);

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
 * Cleveland API no tiene endpoint dedicado para artistas
 * @returns {Promise<[]>}
 */
export const getArtists = async () => {
    try {
        return [];
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error;
    }
};

/**
 * Obtener lista de medios/técnicas
 * @returns {Promise}
 */
export const getMediums = async () => {
    try {
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