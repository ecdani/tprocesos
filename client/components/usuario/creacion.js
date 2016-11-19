
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
        usuario.crear(doneAutenticarse,failCrearUsuario);

        $('#control').empty();
    });
}