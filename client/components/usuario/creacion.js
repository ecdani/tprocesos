
/**
 * Función a ejecutar al cargar la pantalla de registro o creación
 */
function creacionExec() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function(event) {
        event.preventDefault();

        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.email = $('#email').val();
        usuario.crear(doneCreacion,failGenerico);

        $('#control').empty();
    });
}

/**
 * Funcionalidad posterior a creacion.
 */
function doneCreacion(juego, status) {
    $('#control').load('../components/usuario/edicionValidarUsuario.html', function () {
        //$('#enlaceCreacion').on('click', mostrarCreacion); // TODO REENVIAR EL MAIL.
        $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    });
}
