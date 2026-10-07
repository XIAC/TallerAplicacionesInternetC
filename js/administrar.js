// Aporte de Vladimir Condori
// Administrar estudiantes: listar, buscar, editar y eliminar.
// Los datos se guardan en localStorage con la clave "estudiantes".

document.addEventListener("DOMContentLoaded", function () {

    const CLAVE = "estudiantes";

    const DATOS_EJEMPLO = [
        { id: 1, nombre: "Juan", apellido: "Pérez", carrera: "Ingeniería de Sistemas" },
        { id: 2, nombre: "María", apellido: "Gómez", carrera: "Ingeniería Informática" }
    ];

    // ---------- Referencias al DOM ----------
    const tabla = document.getElementById("tablaAdmin");
    const buscador = document.getElementById("buscador");
    const mensajeVacio = document.getElementById("mensajeVacio");
    const estado = document.getElementById("estado");
    const totalEstudiantes = document.getElementById("totalEstudiantes");
    const totalCarreras = document.getElementById("totalCarreras");
    const btnRestaurar = document.getElementById("btnRestaurar");

    const panelEditar = document.getElementById("panelEditar");
    const formEditar = document.getElementById("formEditar");
    const editId = document.getElementById("editId");
    const editNombre = document.getElementById("editNombre");
    const editApellido = document.getElementById("editApellido");
    const editCarrera = document.getElementById("editCarrera");
    const errorEditar = document.getElementById("errorEditar");
    const btnCancelar = document.getElementById("btnCancelar");

    // ---------- Almacenamiento ----------
    function copiaEjemplo() {
        return DATOS_EJEMPLO.map(function (e) { return Object.assign({}, e); });
    }

    function cargar() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE));
            if (Array.isArray(datos)) {
                return datos;
            }
        } catch (error) {
            // Si localStorage no está disponible o tiene datos dañados, usamos el ejemplo
        }
        return copiaEjemplo();
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(estudiantes));
        } catch (error) {
            mostrarEstado("No se pudieron guardar los cambios en este navegador.");
        }
    }

    let estudiantes = cargar();
    guardar();

    // ---------- Utilidades ----------
    // Quita tildes y pasa a minúsculas para que "maria" encuentre "María"
    function normalizar(texto) {
        return String(texto)
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .trim();
    }

    function mostrarEstado(mensaje) {
        estado.textContent = mensaje;
        clearTimeout(mostrarEstado.temporizador);
        mostrarEstado.temporizador = setTimeout(function () {
            estado.textContent = "";
        }, 3000);
    }

    function crearBoton(texto, accion, id, clase) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.className = "boton-accion " + clase;
        boton.dataset.accion = accion;
        boton.dataset.id = id;
        return boton;
    }

    // ---------- Pintar la tabla ----------
    function mostrar() {
        const filtro = normalizar(buscador.value);

        const visibles = estudiantes.filter(function (e) {
            const texto = normalizar(e.nombre + " " + e.apellido + " " + e.carrera);
            return texto.includes(filtro);
        });

        tabla.innerHTML = "";

        visibles.forEach(function (e, indice) {
            const fila = document.createElement("tr");

            [indice + 1, e.nombre, e.apellido, e.carrera].forEach(function (valor) {
                const celda = document.createElement("td");
                celda.textContent = valor; // textContent evita inyectar HTML
                fila.appendChild(celda);
            });

            const acciones = document.createElement("td");
            acciones.className = "celda-acciones";
            acciones.appendChild(crearBoton("Editar", "editar", e.id, "editar"));
            acciones.appendChild(crearBoton("Eliminar", "eliminar", e.id, "eliminar"));
            fila.appendChild(acciones);

            tabla.appendChild(fila);
        });

        mensajeVacio.hidden = visibles.length > 0;

        const carreras = new Set(estudiantes.map(function (e) { return normalizar(e.carrera); }));
        totalEstudiantes.textContent = estudiantes.length;
        totalCarreras.textContent = carreras.size;
    }

    function buscarPorId(id) {
        return estudiantes.find(function (e) { return String(e.id) === String(id); });
    }

    // ---------- Editar ----------
    function abrirEdicion(estudiante) {
        editId.value = estudiante.id;
        editNombre.value = estudiante.nombre;
        editApellido.value = estudiante.apellido;
        editCarrera.value = estudiante.carrera;
        errorEditar.textContent = "";
        panelEditar.hidden = false;
        panelEditar.scrollIntoView({ behavior: "smooth", block: "start" });
        editNombre.focus();
    }

    function cerrarEdicion() {
        formEditar.reset();
        errorEditar.textContent = "";
        panelEditar.hidden = true;
    }

    formEditar.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = editNombre.value.trim();
        const apellido = editApellido.value.trim();
        const carrera = editCarrera.value.trim();

        if (nombre.length < 2 || apellido.length < 2 || carrera.length < 3) {
            errorEditar.textContent = "Completa nombre, apellido y carrera (mínimo 2 letras).";
            return;
        }

        const estudiante = buscarPorId(editId.value);
        if (!estudiante) {
            errorEditar.textContent = "El estudiante ya no existe.";
            return;
        }

        estudiante.nombre = nombre;
        estudiante.apellido = apellido;
        estudiante.carrera = carrera;

        guardar();
        mostrar();
        cerrarEdicion();
        mostrarEstado("Cambios guardados de " + nombre + " " + apellido + ".");
    });

    btnCancelar.addEventListener("click", cerrarEdicion);

    // ---------- Eliminar ----------
    function eliminar(estudiante) {
        const confirmado = confirm("¿Eliminar a " + estudiante.nombre + " " + estudiante.apellido + "?");
        if (!confirmado) {
            return;
        }

        estudiantes = estudiantes.filter(function (e) { return e !== estudiante; });

        if (String(editId.value) === String(estudiante.id)) {
            cerrarEdicion();
        }

        guardar();
        mostrar();
        mostrarEstado(estudiante.nombre + " " + estudiante.apellido + " fue eliminado.");
    }

    // ---------- Eventos ----------
    // Un solo listener para todos los botones de la tabla (delegación de eventos)
    tabla.addEventListener("click", function (event) {
        const boton = event.target.closest("button[data-accion]");
        if (!boton) {
            return;
        }

        const estudiante = buscarPorId(boton.dataset.id);
        if (!estudiante) {
            return;
        }

        if (boton.dataset.accion === "editar") {
            abrirEdicion(estudiante);
        } else if (boton.dataset.accion === "eliminar") {
            eliminar(estudiante);
        }
    });

    buscador.addEventListener("input", mostrar);

    btnRestaurar.addEventListener("click", function () {
        if (!confirm("Esto reemplaza la lista actual por los datos de ejemplo. ¿Continuar?")) {
            return;
        }
        estudiantes = copiaEjemplo();
        buscador.value = "";
        cerrarEdicion();
        guardar();
        mostrar();
        mostrarEstado("Se restauraron los datos de ejemplo.");
    });

    // Si la lista cambia en otra pestaña, se actualiza aquí también
    window.addEventListener("storage", function (event) {
        if (event.key === CLAVE) {
            estudiantes = cargar();
            mostrar();
        }
    });

    mostrar();

});
