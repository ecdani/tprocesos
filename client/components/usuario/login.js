
/**
 * Ejecución de la pantalla de login
 */
function loginExec() {
    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.autenticarse(doneAutenticarse,failAutenticarse);
    });
}