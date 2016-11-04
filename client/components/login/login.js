
/**
 * Ejecución de la pantalla de login
 */
function loginExec() {
    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();
        var nombre = $('#nombre').val();
        var password = $('#password').val();
        autenticarse(nombre, password);
        
        
    });
}