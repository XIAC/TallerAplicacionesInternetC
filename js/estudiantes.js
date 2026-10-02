document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formEstudiante");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const carrera = document.getElementById("carrera").value;

            const nuevoEstudiante = {
                id: Date.now(),
                nombre: nombre,
                apellido: apellido,
                carrera: carrera
            };

            let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
            estudiantes.push(nuevoEstudiante);
            localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

            alert("Estudiante registrado con éxito.");
            formulario.reset();
        });
    }

    const tablaEstudiantes = document.getElementById("tablaEstudiantes");

    if (tablaEstudiantes) {
        function cargarEstudiantes() {
            let estudiantes;
            try {
                estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
                if (!Array.isArray(estudiantes)) estudiantes = null;
            } catch (e) {
                estudiantes = null;
            }

            if (!estudiantes) {
                estudiantes = [
                    { id: 1, nombre: "Juan", apellido: "Pérez", carrera: "Ingeniería de Sistemas" },
                    { id: 2, nombre: "María", apellido: "Gómez", carrera: "Ingeniería Informática" }
                ];
                localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
            }

            tablaEstudiantes.innerHTML = "";

            estudiantes.forEach(est => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${est.id}</td>
                    <td>${est.nombre}</td>
                    <td>${est.apellido}</td>
                    <td>${est.carrera}</td>
                    <td>
                        <button onclick="eliminarEstudiante(${est.id})">Eliminar</button>
                    </td>
                `;
                tablaEstudiantes.appendChild(tr);
            });
        }

        cargarEstudiantes();

        window.eliminarEstudiante = function(id) {
            let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
            estudiantes = estudiantes.filter(est => est.id !== id);
            localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
            cargarEstudiantes();
        };
    }

});