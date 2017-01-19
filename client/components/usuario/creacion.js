
/**
 * Función a ejecutar al cargar la pantalla de registro o creación
 */
function creacionExec() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);
    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.email = $('#email').val();
        usuario.crear(doneCreacion, failGenerico);
        $('#control').empty();
    });
}

/**
 * Funcionalidad posterior a creacion.
 * @param juego, parametro que recibe del servidor
 * @param status, status de la peticion
 */
function doneCreacion(juego, status) {
    $('#control').load('../components/usuario/edicionValidarUsuario.html', function () {
        $('#enlaceCreacion').on('click', function () {
            $("#divCheckPasswordMatch").html("Reenviando...");
            $.get('reenviarMail', function () {
                $("#divCheckPasswordMatch").html("Mail reenviado.");
            });
        }
        );
        $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    });
}
