// src/utils/authUtils.js
export const getSafeUser = () => {
    const storedUser = localStorage.getItem('user');
    try {
        if (storedUser && storedUser !== "undefined") {
            return JSON.parse(storedUser);
        }
    } catch (error) {
        localStorage.removeItem('user');
    }
    return {}; // Devuelve un objeto vacío seguro si algo falla
};