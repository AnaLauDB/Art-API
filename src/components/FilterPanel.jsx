import { useState } from "react";
import styles from "../styles/FilterPanel.module.css";
import manageSearchIcon from '../assets/iconos/manage_search.svg';

export default function FilterPanel({ onFilter, isLoading }) {
    const [filters, setFilters] = useState({
        query: "",
        culture: "",
        type: "",
        creation_date: "",
        department: "",
        technique: "",
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
            culture: "",
            type: "",
            creation_date: "",
            department: "",
            technique: "",
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <div className={styles['filter-panel']}>
            <div className={styles['filter-header']}>
                <h3><img src={manageSearchIcon} alt="Filtros" style={{ width: 20, height: 20, marginRight: 8 }} />Filtros Avanzados</h3>
                {hasActiveFilters && (
                    <button className={styles['reset-btn']} onClick={handleReset} disabled={isLoading}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className={styles['filter-group']}>
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

            <div className={styles['filter-group']}>
                <label htmlFor="culture">Cultura:</label>
                <input
                    type="text"
                    id="culture"
                    name="culture"
                    placeholder="Ej: Egyptian, Greek..."
                    value={filters.culture}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className={styles['filter-group']}>
                <label htmlFor="type">Tipo de Obra:</label>
                <input
                    type="text"
                    id="type"
                    name="type"
                    placeholder="Ej: Painting, Sculpture..."
                    value={filters.type}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className={styles['filter-group']}>
                <label htmlFor="department">Departamento:</label>
                <input
                    type="text"
                    id="department"
                    name="department"
                    placeholder="Ej: Contemporary Art..."
                    value={filters.department}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className={styles['filter-group']}>
                <label htmlFor="technique">Técnica:</label>
                <input
                    type="text"
                    id="technique"
                    name="technique"
                    placeholder="Ej: oil, bronze..."
                    value={filters.technique}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className={styles['filter-group']}>
                <label htmlFor="creation_date">Año de Creación:</label>
                <input
                    type="text"
                    id="creation_date"
                    name="creation_date"
                    placeholder="Ej: 1950"
                    value={filters.creation_date}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <button
                className={styles['apply-btn']}
                onClick={handleApplyFilters}
                disabled={isLoading}
            >
                {isLoading ? "Aplicando filtros..." : "Aplicar filtros"}
            </button>
        </div>
    );
}
