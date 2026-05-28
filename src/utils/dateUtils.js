/**
 * Utilidades para manejo de fechas
 * Funciones para rastrear la "obra de arte diaria" del usuario
 */

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 * Se usa como clave para verificar si el día ha cambiado
 * @returns {string} Fecha en formato YYYY-MM-DD (ej: "2024-01-15")
 */
export const getTodayDateKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Verifica si es un nuevo día comparando con la fecha guardada
 * Se usa para determinar si mostrar una nueva obra aleatoria o la misma
 * @param {string} savedDateKey - Fecha guardada en formato YYYY-MM-DD
 * @returns {boolean} true si es un día diferente, false si es el mismo día
 */
export const isNewDay = (savedDateKey) => {
    if (!savedDateKey) {
        return true; // Si no hay fecha guardada, es "nuevo día"
    }

    const todayKey = getTodayDateKey();
    return todayKey !== savedDateKey;
};

/**
 * Obtiene información legible del día (para debugging o display)
 * @returns {object} Objeto con información del día actual
 */
export const getDayInfo = () => {
    const today = new Date();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return {
        dateKey: getTodayDateKey(),
        dayName: dayNames[today.getDay()],
        monthName: monthNames[today.getMonth()],
        date: today.getDate(),
        year: today.getFullYear()
    };
};

/**
 * Calcula la hora exacta hasta la medianoche
 * Útil para caché con expiración o logs
 * @returns {object} Objeto con horas, minutos, segundos hasta medianoche
 */
export const getTimeUntilMidnight = () => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - today;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
};
