# Resumen por fases del proyecto

Este documento describe, de forma concisa, qué scripts/componentes pertenecen a cada fase, el objetivo de la fase y las tecnologías usadas.

---

## Fase 1 — Corrección de paginación
- **Objetivo:** Hacer que los botones de paginación re-consulten la API y muestren obras correctas.
- **Componentes / archivos:** `App.jsx`, `ArtworkGrid.jsx`, `ArtworkCard.jsx`, `SearchBar.jsx`, `services/arteServices.js` (lógica de consulta y mapeo básico).
- **Tecnologías:** React (hooks), Axios, Vite.

## Fase 2 — Migración a Cleveland Open Access API
- **Objetivo:** Cambiar la fuente de datos a `https://openaccess-api.clevelandart.org/api/artworks`.
- **Componentes / archivos:** `services/arteServices.js` (nuevos endpoints y mapeo de respuesta), `App.jsx` (ajustes de parámetros de búsqueda/paginación).
- **Tecnologías:** Cleveland Open Access API, Axios.

## Fase 3 — Filtrar solo obras con imagen
- **Objetivo:** Excluir resultados sin imagen para evitar páginas vacías y mejorar UX.
- **Componentes / archivos:** `services/arteServices.js` (filtrado y mapeo), `ArtworkGrid.jsx` (muestra vacía / mensaje cuando no hay items).
- **Tecnologías:** JavaScript (array filter/mapping).

## Fase 4 — Optimización de imágenes
- **Objetivo:** Cargar imágenes responsivas y perezosas con `srcset`/`sizes` y `IntersectionObserver`.
- **Componentes / archivos:** `ArtworkCard.jsx`, `OptimizedImage.jsx` (o `imageServices.js` si existe), estilos en `styles/*.css`.
- **Tecnologías:** `srcset`/`sizes`, `IntersectionObserver`, lazy-loading, CSS responsivo.

## Fase 5 — Obra del día (persistencia por día)
- **Objetivo:** Mostrar una "obra del día" y persistir elección por día para usuarios autenticados.
- **Componentes / archivos:** `App.jsx` (orquestador del modal), `ArtworkDetail.jsx`, lógica de persistencia (LocalStorage / backend auth helper), posibles hooks `useDailyArtwork`.
- **Tecnologías:** LocalStorage, autenticación básica (token), React state/modal.

## Fase 6 — Migración a Redux (thunks)
- **Objetivo:** Centralizar lógica asíncrona en Redux, usar thunks para búsquedas y paginación y mantener estado global consistente.
- **Componentes / archivos:** `src/redux/slices/artworksSlice.js` (thunks: `searchArtworksAsync`, `filterArtworksAsync`), `App.jsx` (dispatch/selectors), `services/arteServices.js` (API wrapper).
- **Tecnologías:** Redux Toolkit (`createSlice`, `createAsyncThunk`), Axios.

## Fase 7 — UX: limpiar filtros y título clickable
- **Objetivo:** Añadir botón "Limpiar filtros" y hacer el título clicable para volver a la búsqueda inicial.
- **Componentes / archivos:** `FilterPanel.jsx` (`handleReset()`), `App.jsx` (intercepta filtros vacíos y re-dispatch de búsqueda), estilos en `styles/FilterPanel.css`.
- **Tecnologías:** React, Redux (para estado/dispatch de página), CSS.

## Fase 8 — Robustez: fallback por CORS/Network
- **Objetivo:** Si la API principal falla por CORS o red, usar un fallback (Art Institute API) para mantener la app funcional en desarrollo.
- **Componentes / archivos:** `services/arteServices.js` (catch con intento a `https://api.artic.edu/api/v1/artworks/search` y mapeo a la forma esperada).
- **Tecnologías:** Axios, Art Institute API (fallback), manejo de errores.

---

Notas rápidas:
- Los archivos principales de UI están en `src/components/` y los servicios en `src/services/arteServices.js`.
- Tests / capturas usadas durante el desarrollo están planeados en `docs/screenshots/` y Playwright puede usarse para E2E.
- Para cualquier fase que quieras que documente con más detalle (ej.: endpoints exactos, shapes de respuesta, ejemplos de `srcset`), dime cuál y lo amplio.
