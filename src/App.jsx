import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import ArtworkGrid from "./components/ArtworkGrid";
import ArtworkDetail from "./components/ArtworkDetail";
import DailyArtworkModal from "./components/DailyArtworkModal";
import Header from "./components/Shared/Header";
import AuthModal from "./components/Auth/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import GalleryErrorBoundary from "./components/GalleryErrorBoundary";
import DailyPickErrorBoundary from "./components/DailyPickErrorBoundary";
import { searchArtworks, getArtworksByFilters } from "./services/arteServices";
import { setUser } from "./redux/slices/authSlice";
import { getCurrentUser, getToken } from "./services/authServices";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Estados para rastrear la búsqueda/filtro actual
  const [lastSearchQuery, setLastSearchQuery] = useState("art");
  const [lastFilters, setLastFilters] = useState(null);

  /**
   * Al montar, verificar si hay usuario guardado en localStorage
   * Si existe, cargar en Redux para mantener sesión persistente
   */
  useEffect(() => {
    const savedUser = getCurrentUser();
    const token = getToken();

    if (savedUser && token) {
      dispatch(setUser({
        user: savedUser,
        token: token,
      }));
    }
  }, [dispatch]);

  // Buscar obras por término
  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    setLastSearchQuery(query); // Guardar la búsqueda actual
    setLastFilters(null);      // Limpiar filtros cuando buscamos por término

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
    setLastSearchQuery(null);  // Limpiar búsqueda cuando usamos filtros
    setLastFilters(filters);   // Guardar los filtros actuales

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

  /**
   * NUEVO: Cuando cambie currentPage, repetir la búsqueda/filtro con la nueva página
   * Esto es lo que faltaba para que la paginación funcione correctamente
   */
  useEffect(() => {
    // Solo ejecutar si currentPage NO es 1 (porque la búsqueda inicial ya carga página 1)
    if (currentPage === 1) return;

    setIsLoading(true);
    setError(null);

    const performPaginatedSearch = async () => {
      try {
        let result;

        // Si hay una búsqueda activa, repetirla con la nueva página
        if (lastSearchQuery) {
          result = await searchArtworks(lastSearchQuery, 12, currentPage);
        }
        // Si hay filtros activos, repetirlos con la nueva página
        else if (lastFilters) {
          result = await getArtworksByFilters({
            ...lastFilters,
            limit: 12,
            page: currentPage,
          });
        }

        if (result) {
          setArtworks(result.data || []);
          setTotalPages(result.pagination?.total_pages || 1);
          // Scroll al inicio de la galería para mejor UX
          document.querySelector(".content")?.scrollIntoView({ behavior: "smooth" });
        }
      } catch (err) {
        setError("Error al cambiar de página. Intenta de nuevo.");
        console.error(err);
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    performPaginatedSearch();
  }, [currentPage, lastSearchQuery, lastFilters]);

  return (
    <div className="app-container">
      <Header />

      <header className="app-header">
        <div className="header-content">
          <h1>🎨 Art Institute Explorer</h1>
          <p>Explora las mejores obras de arte del Art Institute de Chicago</p>
        </div>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </header>

      {isLoggedIn && (
        <DailyPickErrorBoundary>
          <DailyArtworkModal />
        </DailyPickErrorBoundary>
      )}

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

      <AuthModal />

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
