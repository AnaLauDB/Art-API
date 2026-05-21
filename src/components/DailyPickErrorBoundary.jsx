import React from 'react';

/**
 * DailyPickErrorBoundary - Error Boundary Regional
 * Captura SOLO errores en la sección de Obra Diaria
 * 
 * Ventaja: Si falla la obra diaria, NO se rompe toda la galería
 * El usuario puede seguir navegando las obras normalmente
 */
class DailyPickErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'Error en obra del día',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error en DailyPick:', error);
    console.error('📍 Info:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>⚠️ No pudimos cargar tu obra de arte sorpresa</h2>

          <p>
            {this.state.errorMessage}
          </p>

          <p>
            No te preocupes, puedes seguir explorando la galería de obras.
            Intenta recargar la página más tarde.
          </p>

          <button onClick={() => window.location.reload()}>
            🔄 Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DailyPickErrorBoundary;
