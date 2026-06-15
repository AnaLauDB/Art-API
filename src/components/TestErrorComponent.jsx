import React from 'react';

/**
 * TestErrorComponent - Componente para PROBAR Error Boundaries
 * 
 * ¿Cómo usarlo?
 * 1. Importarlo en App.jsx
 * 2. Renderizarlo (va a lanzar un error)
 * 3. Verás cómo el Error Boundary lo captura
 * 4. Luego bórralo
 * 
 * NO incluir en producción
 */
class TestErrorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldThrowError: false,
        };
    }

    handleTriggerError = () => {
        this.setState({ shouldThrowError: true });
    };

    render() {
        // Esto LANZA un error cuando shouldThrowError es true
        if (this.state.shouldThrowError) {
            throw new Error(
                'Error de prueba: Este error fue capturado por Error Boundary'
            );
        }

        return (
            <div>
                <h3>🧪 Componente de Prueba - Error Boundary</h3>
                <p>
                    Este es un componente de demostración para probar los Error Boundaries.
                </p>
                <button onClick={this.handleTriggerError}>
                    ❌ Hacer que Error Boundary capture un error
                </button>
            </div>
        );
    }
}

export default TestErrorComponent;
