
/**
 * Función para ejecutar al cargar la pantalla de edición
 */
function edicionExec() {
    var usuario = $.cookie("usuario");
    usuario = $.parseJSON(usuario);
    console.log(usuario)
    $('#email').val(usuario.email);

    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();

        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.email = $('#email').val();
        usuario.editar(doneEditar, failGenerico);

    });

    $('#borrarBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.borrar(logout, failGenerico);
    });
}

/**
 * Funcionalidad posterior a la edición de un usuario.
 */
function doneEditar(data, status) {
    console.log('El usuario que llega de la edicion:')
    console.log(data);
    $.cookie("usuario", JSON.stringify(data));
    $("#divCheckPasswordMatch").html("Usuario actualizado.");
}