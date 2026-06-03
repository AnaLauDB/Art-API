import { useState } from "react";
import styles from "../styles/SearchBar.module.css";

export default function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleClear = () => {
        setQuery("");
    };

    return (
        <form className={styles['search-bar']} onSubmit={handleSubmit}>
            <div className={styles['search-container']}>
                <input
                    type="text"
                    className={styles['search-input']}
                    placeholder="Busca obras de arte, artistas, técnicas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                {query && (
                    <button
                        type="button"
                        className={styles['clear-btn']}
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
                <button
                    type="submit"
                    className={styles['search-btn']}
                    disabled={isLoading || !query.trim()}
                    aria-label="Buscar"
                >
                    {isLoading ? (
                        <>
                            <span className={styles['spinner']}></span>
                            Buscando...
                        </>
                    ) : (
                        <>
                            Buscar
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
