# 🎨 Art Institute Explorer

Un buscador inteligente de obras de arte que permite a los usuarios explorar contenido del Art Institute of Chicago mediante búsqueda semántica, filtros dinámicos y una experiencia visual fluida.

## 🚀 Características

- **Búsqueda Semántica**: Busca obras de arte por términos, artistas, técnicas y períodos
- **Filtros Dinámicos Avanzados**:
  - Búsqueda por palabras clave
  - Filtrado por artista
  - Filtrado por material/técnica
  - Rango de fechas (año de creación)
  - Filtrado por cultura
  
- **Galería Visual Fluida**: Interfaz responsive con animaciones suaves
- **Vista Detallada**: Modal con información completa de cada obra
- **Paginación Inteligente**: Navegación fácil entre páginas de resultados
- **Diseño Responsive**: Funciona perfectamente en desktop, tablet y móvil

## 📋 Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Conexión a Internet (para consumir la API del Art Institute)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/AnaLauDB/Art-API.git
   cd Art-API
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📦 Estructura del Proyecto

```
src/
├── components/
│   ├── SearchBar.jsx          # Componente de búsqueda principal
│   ├── FilterPanel.jsx        # Panel de filtros avanzados
│   ├── ArtworkCard.jsx        # Tarjeta individual de obra
│   ├── ArtworkGrid.jsx        # Galería de obras
│   └── ArtworkDetail.jsx      # Modal detallado de obra
├── services/
│   └── arteServices.js        # Servicio para consumir API ARTIC
├── styles/
│   ├── SearchBar.css          # Estilos del buscador
│   ├── FilterPanel.css        # Estilos de filtros
│   ├── ArtworkGrid.css        # Estilos de galería
│   └── ArtworkDetail.css      # Estilos del modal
├── App.jsx                    # Componente principal
├── App.css                    # Estilos globales
└── main.jsx                   # Punto de entrada
```

## 🔌 API Utilizada

**Art Institute of Chicago API v1**
- Documentación: https://api.artic.edu/docs/
- Base URL: `https://api.artic.edu/api/v1`

### Endpoints Principales

- `/artworks/search` - Búsqueda de obras con filtros
- `/artworks/{id}` - Detalles de una obra específica
- `/artists` - Lista de artistas
- `/artworks/search?facets=medium_display` - Agregaciones de medios

## 💻 Uso

### Búsqueda Simple

1. Ingresa un término en la barra de búsqueda (ej: "paisaje", "Van Gogh", "óleo")
2. Haz clic en "Buscar" o presiona Enter
3. Los resultados se mostrarán en la galería

### Filtros Avanzados

1. Usa el panel de filtros en la izquierda para aplicar criterios específicos
2. Combina múltiples filtros para refinar resultados
3. Haz clic en "Aplicar filtros" para actualizar la búsqueda
4. Usa "Limpiar filtros" para restablecer

### Ver Detalles

1. Haz clic en cualquier obra de arte en la galería
2. Se abrirá un modal con información completa
3. Haz clic en "Ver en el Art Institute" para más información
4. Cierra el modal con el botón X

## 🎨 Tecnologías Utilizadas

- **React 19.2.5** - Librería de UI
- **Vite 8.0.10** - Build tool y dev server
- **Axios 1.15.2** - Cliente HTTP
- **CSS3** - Estilos con grid, flexbox y animaciones
- **JavaScript ES6+** - Lenguaje de programación

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run preview      # Previsualizar build

# Calidad de código
npm run lint         # Ejecutar ESLint
```

## 📱 Responsive Design

La aplicación es totalmente responsive:
- **Desktop**: Barra lateral + galería principal
- **Tablet**: Layout adaptado (600px+)
- **Mobile**: Stack vertical optimizado (480px+)

## 🔍 Ejemplos de Búsqueda

- **Artista**: "Pablo Picasso", "Leonardo da Vinci"
- **Técnica**: "óleo", "escultura", "fotografía"
- **Tema**: "paisaje", "retrato", "naturaleza muerta"
- **Período**: Combina años (ej: 1890-1900)

## 🌐 Características API

### Búsqueda Semántica
```javascript
// Buscar con términos combinados
await searchArtworks("impressionism painting");

// Con filtros avanzados
await getArtworksByFilters({
  query: "portrait",
  artist: "Rembrandt",
  medium: "oil",
  yearFrom: "1630",
  yearTo: "1669"
});
```

### Gestión de Imágenes
```javascript
// URLs de imágenes optimizadas
getImageUrl(imageId, "small")    // 150x150
getImageUrl(imageId, "medium")   // 400x400
getImageUrl(imageId, "large")    // 843x843
```

## ⚙️ Configuración

### Variables de Entorno

No requiere configuración especial. La API es pública y accesible sin autenticación.

### Build

El proyecto usa Vite con React. La configuración está en `vite.config.js`.

## 🐛 Troubleshooting

### "No se pudieron cargar las obras de arte"
- Verifica tu conexión a Internet
- Comprueba que la API está disponible: https://api.artic.edu/api/v1/artworks/search
- Revisa la consola del navegador para ver el error específico

### Imágenes no cargan
- Algunas obras antiguas pueden no tener imágenes digitalizadas
- La aplicación mostrará un placeholder en estos casos

### Rendimiento lento
- Reduce el número de resultados por página
- Usa filtros más específicos para limitar resultados

## 🎯 Mejoras Futuras

- [ ] Guardar búsquedas favoritas (localStorage)
- [ ] Comparar múltiples obras
- [ ] Historial de búsquedas
- [ ] Compartir en redes sociales
- [ ] Exportar información de obras
- [ ] Modo oscuro
- [ ] Filtros por movimiento artístico
- [ ] Recomendaciones personalizadas

## 📄 Licencia

Este proyecto utiliza datos del Art Institute of Chicago bajo su política de Open Access.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👤 Autor

**Ana Lau**
- GitHub: [@AnaLauDB](https://github.com/AnaLauDB)

## 📞 Soporte

Si encuentras problemas o tienes sugerencias, por favor:
- Abre un issue en GitHub
- Contacta a través de GitHub Issues

## 🙏 Agradecimientos

- Art Institute of Chicago por proporcionar la API pública
- Comunidad de React y Vite
- Todos los contribuidores
