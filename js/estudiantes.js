document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formEstudiante");

    if (formulario) {

        formulario.addEventListener("submit", function (event) {

            event.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const carrera = document.getElementById("carrera").value;

            alert(
                "Estudiante registrado:\n\n" +
                nombre + " " +
                apellido + "\n" +
                carrera
            );

            formulario.reset();

        });

    }

});