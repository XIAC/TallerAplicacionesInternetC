
const CLAVE = "estudiantes";

function obtenerEstudiantes() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE));
        if (Array.isArray(datos)) return datos;
    } catch (e) { /* datos dañados: se reinician */ }
    const iniciales = [
        { id: 1, nombre: "Juan", apellido: "Pérez", carrera: "Ingeniería de Sistemas" },
        { id: 2, nombre: "María", apellido: "Gómez", carrera: "Ingeniería Informática" }
    ];
    guardarEstudiantes(iniciales);
    return iniciales;
}

function guardarEstudiantes(lista) {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}

function siguienteId(lista) {
    return lista.reduce((max, e) => Math.max(max, e.id), 0) + 1;
}