
/**
 * Ejecucion de la pantalla de edicion
 */
function edicionExec() {
    var usuario = $.cookie("usuario");
    usuario = $.parseJSON(usuario);
    console.log(usuario)
    $('#nombre').val(usuario.nombre);

    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function(event) {
        event.preventDefault();
        nombre = $('#nombre').val();
        password = $('#password').val();
        editarUsuario(nombre, password);
    });

    $('#borrarBtn').on('click', function(event) {
        event.preventDefault();
        nombre = $('#nombre').val();;
        borrarUsuario(nombre);
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
        console.log('El usuario que llega de la edicion:')
        console.log(data);
        $.cookie("usuario", JSON.stringify(data));
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
                console.log(jqXHR);
                $("#divCheckPasswordMatch").html("Error indeterminado.");
        }
    });
}

/**
 * Peticion de borrado
 */
function borrarUsuario(nombre) {
    $.post("/borrarUsuario", {
        nombre: nombre
    }, function(data, status) {
        logout();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        switch (jqXHR.status) {
            case 500:
                console.log(jqXHR);
                $("#divCheckPasswordMatch").html("Error en el servidor.");
                break;
            default:
                console.log(jqXHR);
                $("#divCheckPasswordMatch").html("Error indeterminado.");
        }
    });
}