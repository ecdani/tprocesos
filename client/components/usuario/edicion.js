
/**
 * Función para ejecutar al cargar la pantalla de edición
 */
function edicionExec() {
    var usuario = $.cookie("usuario");
    usuario = $.parseJSON(usuario);
    console.log(usuario)
    $('#nombre').val(usuario.nombre);

    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function(event) {
        event.preventDefault();

        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.editar(doneEditar, failEditar);

    });

    $('#borrarBtn').on('click', function(event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.borrar(logout, failBorrar);
    });
}
