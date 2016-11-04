
/**
 * Ejecución de la pantalla de login
 */
function loginExec() {
    $('#nombreBtn').on('click', function (event) {
        nombre = $('#nombre').val();
        password = $('#password').val();
        autenticarse(nombre, password);
    });
}