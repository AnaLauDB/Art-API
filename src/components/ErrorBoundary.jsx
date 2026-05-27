import React from 'react';

/**
 * ErrorBoundary - Componente Global de Clase
 * Captura TODOS los errores de rendering en componentes hijos
 * 
 * ¿Por qué es una clase?
 * - Error Boundaries SOLO funcionan con componentes de clase
 * - Los functional components NO pueden ser Error Boundaries
 * 
 * ¿Qué captura?
 * ✅ Errores en render()
 * ✅ Errores en constructores
 * ✅ Errores en ciclos de vida (useEffect, etc)
 * ❌ NO captura errores en event listeners (usa try/catch)
 * ❌ NO captura errores async/await (usa try/catch)
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        // Estado del Error Boundary
        this.state = {
            hasError: false,           // ¿Hubo error?
            errorMessage: '',          // Mensaje del error
            errorStack: '',            // Stack trace (para debugging)
        };
    }

    /**
     * getDerivedStateFromError()
     * Se ejecuta cuando detecta un error
     * Retorna el nuevo estado
     */
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error.message || 'Error desconocido',
        };
    }

    /**
     * componentDidCatch()
     * Se ejecuta DESPUÉS de getDerivedStateFromError
     * Úsalo para:
     * - Loguear el error (consola, servidor, analytics)
     * - Hacer debugging
     * 
     * NO modifiques estado aquí (usa getDerivedStateFromError)
     */
    componentDidCatch(error, errorInfo) {
        console.error(' Error capturado por ErrorBoundary:', error);
        console.error(' Error Info:', errorInfo);

        // Guardar stack trace para debugging
        this.setState({
            errorStack: errorInfo.componentStack,
        });

        // En producción, aquí enviarías el error a un servicio
        // Ej: Sentry, LogRocket, servicio personalizado
        // reportErrorToService(error, errorInfo);
    }

    /**
     * Método para permitir reintentar
     */
    handleReset = () => {
        this.setState({
            hasError: false,
            errorMessage: '',
            errorStack: '',
        });
    };

    render() {
        // Si hay error, mostrar fallback UI
        if (this.state.hasError) {
            return (
                <div>
                    <h1>¡Oops! Algo salió mal</h1>

                    <p>
                        <strong>Error:</strong> {this.state.errorMessage}
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <details>
                            <summary> Detalles técnicos (solo desarrollo)</summary>
                            <pre>
                                {this.state.errorStack}
                            </pre>
                        </details>
                    )}

                    <div>
                        <button onClick={this.handleReset}>
                            Reintentar
                        </button>

                        <button onClick={() => window.location.href = '/'}>
                            Ir a Inicio
                        </button>
                    </div>
                </div>
            );
        }

        // Si NO hay error, renderizar componentes hijos normalmente
        return this.props.children;
    }
}

export default ErrorBoundary;
