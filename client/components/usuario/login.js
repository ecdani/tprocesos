
/**
 * Función a ejecutar al cargar la pantalla de login
 */
function loginExec() {
    $('#emailBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.email = $('#email').val();
        usuario.password = $('#password').val();
        usuario.autenticarse(doneAutenticarse,failGenerico);

    });
}