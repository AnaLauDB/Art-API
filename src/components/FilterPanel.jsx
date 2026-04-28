import { useState } from "react";
import "../styles/FilterPanel.css";

export default function FilterPanel({ onFilter, isLoading }) {
    const [filters, setFilters] = useState({
        query: "",
        artist: "",
        medium: "",
        yearFrom: "",
        yearTo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        onFilter(filters);
    };

    const handleReset = () => {
        const emptyFilters = {
            query: "",
            artist: "",
            medium: "",
            yearFrom: "",
            yearTo: "",
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h3>🎨 Filtros Avanzados</h3>
                {hasActiveFilters && (
                    <button className="reset-btn" onClick={handleReset} disabled={isLoading}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="filter-group">
                <label htmlFor="query">Búsqueda:</label>
                <input
                    type="text"
                    id="query"
                    name="query"
                    placeholder="Palabra clave..."
                    value={filters.query}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="artist">Artista:</label>
                <input
                    type="text"
                    id="artist"
                    name="artist"
                    placeholder="Nombre del artista..."
                    value={filters.artist}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="medium">Material/Técnica:</label>
                <input
                    type="text"
                    id="medium"
                    name="medium"
                    placeholder="Ej: óleo, escultura..."
                    value={filters.medium}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <label htmlFor="yearFrom">Año desde:</label>
                    <input
                        type="number"
                        id="yearFrom"
                        name="yearFrom"
                        placeholder="1800"
                        value={filters.yearFrom}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="yearTo">Año hasta:</label>
                    <input
                        type="number"
                        id="yearTo"
                        name="yearTo"
                        placeholder="2024"
                        value={filters.yearTo}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <button
                className="apply-btn"
                onClick={handleApplyFilters}
                disabled={isLoading}
            >
                {isLoading ? "Aplicando filtros..." : "Aplicar filtros"}
            </button>
        </div>
    );
}
