import React from 'react';

/**
 * GalleryErrorBoundary - Error Boundary Regional
 * Captura SOLO errores en la Galería de Obras (ArtworkGrid)
 * 
 * Ventaja: Si falla la galería, se muestra un mensaje específico
 * pero el usuario puede reintentar sin que se rompa toda la app
 */
class GalleryErrorBoundary extends React.Component {
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
            errorMessage: error.message || 'Error en la galería',
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error en Galería:', error);
        console.error('Info:', errorInfo.componentStack);

        // Podría ser útil para analytics
        // trackError('gallery-error', error.message);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            errorMessage: '',
        });

        // Recargar las obras si es necesario
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Error en la Galería</h2>

                    <p>
                        {this.state.errorMessage}
                    </p>

                    <p>
                        Parece que ocurrió un problema al cargar la galería de obras.
                        Intenta recargar o buscar de nuevo.
                    </p>

                    <div>
                        <button onClick={this.handleRetry}>
                            Reintentar
                        </button>

                        <button onClick={() => window.location.href = '/'}>
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GalleryErrorBoundary;
