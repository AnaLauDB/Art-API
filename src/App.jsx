import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import ArtworkGrid from "./components/ArtworkGrid";
import ArtworkDetail from "./components/ArtworkDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import GalleryErrorBoundary from "./components/GalleryErrorBoundary";
import DailyPickErrorBoundary from "./components/DailyPickErrorBoundary";
import { searchArtworks, getArtworksByFilters } from "./services/arteServices";
import "./App.css";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Buscar obras por término
  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const result = await searchArtworks(query, 12, 1);
      setArtworks(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (err) {
      setError(
        "No se pudieron cargar las obras de arte. Intenta de nuevo."
      );
      console.error(err);
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros avanzados
  const handleFilter = useCallback(async (filters) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const result = await getArtworksByFilters({
        ...filters,
        limit: 12,
        page: 1,
      });
      setArtworks(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (err) {
      setError("Error al aplicar los filtros. Intenta de nuevo.");
      console.error(err);
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar obras iniciales al montar
  useEffect(() => {
    handleSearch("art");
  }, [handleSearch]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎨 Art Institute Explorer</h1>
          <p>Explora las mejores obras de arte del Art Institute de Chicago</p>
        </div>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </header>

      <main className="app-main">
        <div className="app-layout">
          <aside className="sidebar">
            <FilterPanel onFilter={handleFilter} isLoading={isLoading} />
          </aside>

          <section className="content">
            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
                <button onClick={() => handleSearch("art")}>
                  Intentar de nuevo
                </button>
              </div>
            )}

            <GalleryErrorBoundary>
              <ArtworkGrid
                artworks={artworks}
                onArtworkClick={setSelectedArtwork}
                isLoading={isLoading}
              />
            </GalleryErrorBoundary>

            {totalPages > 1 && !isLoading && artworks.length > 0 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}

      <footer className="app-footer">
        <p>
          © 2024 Art Institute Explorer • Datos del{" "}
          <a
            href="https://www.artic.edu/open-access"
            target="_blank"
            rel="noopener noreferrer"
          >
            Art Institute of Chicago
          </a>
        </p>
      </footer>
    </div>
  );
}

/**
 * Envolver la aplicación con ErrorBoundary global
 * Esto captura CUALQUIER error en cualquier parte de la app
 * Si algo falla, el usuario verá un mensaje amigable en lugar de blank page
 */
function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;
