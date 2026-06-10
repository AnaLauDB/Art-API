import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterPanel from "./components/FilterPanel";
import ArtworkGrid from "./components/ArtworkGrid";
import ArtworkDetail from "./components/ArtworkDetail";
import DailyArtworkModal from "./components/DailyArtworkModal";
import Header from "./components/Shared/Header";
import UserProfile from "./components/UserProfile";
import AuthModal from "./components/Auth/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import GalleryErrorBoundary from "./components/GalleryErrorBoundary";
import DailyPickErrorBoundary from "./components/DailyPickErrorBoundary";
import {
  searchArtworksAsync,
  filterArtworksAsync,
  setCurrentPage,
} from "./redux/slices/artworksSlice";
import { setUser } from "./redux/slices/authSlice";
import { getCurrentUser, getToken } from "./services/authServices";
import "./App.css";
import styles from "./App.module.css";
import Logo from "./assets/Logo_ClevelandArt.jpeg";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const showProfile = useSelector((state) => state.ui.showProfile);
  const {
    items: artworks,
    loading: isLoading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.artworks);
  const [localSelectedArtwork, setLocalSelectedArtwork] = useState(null);

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
      dispatch(
        setUser({
          user: savedUser,
          token: token,
        }),
      );
    }
  }, [dispatch]);

  // Buscar obras por término
  const handleSearch = useCallback(
    async (query) => {
      setLastSearchQuery(query); // Guardar la búsqueda actual
      setLastFilters(null); // Limpiar filtros cuando buscamos por término
      dispatch(setCurrentPage(1));
      dispatch(searchArtworksAsync({ query, limit: 12, page: 1 }));
    },
    [dispatch],
  );

  // Aplicar filtros avanzados
  const handleFilter = useCallback(
    async (filters) => {
      // Si no hay filtros activos, tratar como 'limpiar filtros' y volver a la búsqueda por defecto
      const hasAny = Object.values(filters || {}).some(
        (v) => v && String(v).trim() !== "",
      );
      if (!hasAny) {
        setLastFilters(null);
        setLastSearchQuery("art");
        dispatch(setCurrentPage(1));
        dispatch(searchArtworksAsync({ query: "art", limit: 12, page: 1 }));
        return;
      }

      setLastSearchQuery(null); // Limpiar búsqueda cuando usamos filtros
      setLastFilters(filters); // Guardar los filtros actuales
      dispatch(setCurrentPage(1));
      dispatch(filterArtworksAsync({ filters, limit: 12, page: 1 }));
    },
    [dispatch],
  );

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

    // Re-disparar la búsqueda o el filtro según el contexto guardado
    if (lastSearchQuery) {
      dispatch(
        searchArtworksAsync({
          query: lastSearchQuery,
          limit: 12,
          page: currentPage,
        }),
      );
    } else if (lastFilters) {
      dispatch(
        filterArtworksAsync({
          filters: lastFilters,
          limit: 12,
          page: currentPage,
        }),
      );
    }

    // Scroll al inicio de la galería para mejor UX
    document.querySelector(".content")?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage, lastSearchQuery, lastFilters, dispatch]);

  return (
    <div className="app-container">
      <Header />

      <header className="app-header">
        <div className="header-content">
          <div
            className={styles.logoWrap}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setLastSearchQuery("art");
              setLastFilters(null);
              dispatch(setCurrentPage(1));
              dispatch(
                searchArtworksAsync({ query: "art", limit: 12, page: 1 }),
              );
            }}
          >
            <img
              src={Logo}
              alt="Logo Cleveland Art Museum"
              className={styles.logo}
            />
            <h1 className={styles.siteTitle}>Cleveland Art Museum</h1>
          </div>
          <p className={styles.siteSubtitle}>
            Explora las mejores obras de arte del Cleveland Art Museum
          </p>
        </div>
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
                <p> {error}</p>
                <button onClick={() => handleSearch("art")}>
                  Intentar de nuevo
                </button>
              </div>
            )}

            {showProfile ? (
              <UserProfile />
            ) : (
              <>
                <GalleryErrorBoundary>
                  <ArtworkGrid
                    artworks={artworks}
                    onArtworkClick={setLocalSelectedArtwork}
                    isLoading={isLoading}
                  />
                </GalleryErrorBoundary>

                {totalPages > 1 && !isLoading && artworks.length > 0 && (
                  <div className="pagination">
                    <button
                      onClick={() => {
                        const next = Math.max(1, currentPage - 1);
                        dispatch(setCurrentPage(next));
                      }}
                      disabled={currentPage === 1}
                    >
                      ← Anterior
                    </button>
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => {
                        const next = Math.min(totalPages, currentPage + 1);
                        dispatch(setCurrentPage(next));
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {localSelectedArtwork && (
        <ArtworkDetail
          artwork={localSelectedArtwork}
          onClose={() => setLocalSelectedArtwork(null)}
        />
      )}

      <AuthModal />

      <footer className="app-footer">
        <p>
          © 2024 Cleveland Art Museum • Datos del{" "}
          <a
            href="https://openaccess-api.clevelandart.org/?utm_source=chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cleveland Art Museum
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
