
/**
 * Ejecucion de la pantalla de edicion
 */
function edicionExec() {
    var usuario = $.cookie("usuario");
    usuario = $.parseJSON(usuario);
    $('#nombre').val(usuario.nombre);

    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function() {
        nombre = $('#nombre').val();
        password = $('#password').val();
        editarUsuario(nombre, password);
    });
}

/**
 * Peticion de edicion
 */
function editarUsuario(nombre, password) {
    $.post("/editarUsuario", {
        nombre: nombre,
        password: password
    }, function(data, status) {
        $("#divCheckPasswordMatch").html("Usuario actualizado.");

    }).fail(function(jqXHR, textStatus, errorThrown) {
        switch (jqXHR.status) {
            case 409:
                console.log(jqXHR);
                $("#divCheckPasswordMatch").html("El nombre de usuario ya existe.");
                break;
            case 500:
                console.log(jqXHR);
                $("#divCheckPasswordMatch").html("Error en el servidor.");
                break;
            default:
        }
    });
}