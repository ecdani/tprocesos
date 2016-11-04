
/**
 * Librería de funciones compartidas de 
 * la gestión de usuarios.
 */

/**
 * Comprobacion de contraseñas.
 */
function checkPasswordMatch() {
    var password = $("#password").val();
    var confirmPassword = $("#validarpassword").val();

    if (password != confirmPassword) {
        $('#nombreBtn').prop("disabled", true);
        $("#divCheckPasswordMatch").html("Las contraseñas no coinciden.");
    } else {
        $('#nombreBtn').prop("disabled", false);
        $("#divCheckPasswordMatch").html("Las contraseñas coinciden");
    }
}

/**
 * Autenticar usuarios
 */
function autenticarse(nombre, password) {
    console.log("Autenticando");
    console.log("nombre" + nombre);
    console.log("password" + password);
    $.post("/autenticarse", {
        nombre: nombre,
        password: password
    },function(data, status) {
        console.log("Exito Autenticacion");
        callbackAutenticarse(data, status);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        
        switch (jqXHR.status) {
            case 404:
                console.log(jqXHR);
                $("#autenticacionInfo").html("Usuario no encontrado.");
                break;
            case 500:
                console.log(jqXHR);
                $("#autenticacionInfo").html("Error en el servidor.");
                break;
            case 401:
                console.log(jqXHR);
                $("#autenticacionInfo").html("Contraseña incorrecta.");
                break;
            default:
                console.log("Error Autenticacion");
                console.log(jqXHR);
        }
    });
}

/**
 * Funcionalidad posterior a autenticarse.
 */
function callbackAutenticarse(data, status) {
    console.log("Entrando en callback Autenticarse");
    console.log(status);
    juego = data;
    var usuario = juego.usuarios[0];

    $('.enlaceAutenticacion').html('Editar cuenta');
    $('.enlaceAutenticacion').unbind();
    $('.enlaceAutenticacion').on('click', mostrarEdicion);

    $.cookie("usuario", JSON.stringify(usuario));

    mostrarJuego(usuario);
}

/**
 * Muestra la edición
 */
function mostrarEdicion(event) {
    $.when(
        $('#control').load('../components/edicion/edicion.html'),
        $.getScript("../components/edicion/edicion.js")).then(function() {
            edicionExec();
        });
}

/**
 * Iniciar el juego
 */
function mostrarJuego(usuario) {
    $.when(
        $.getScript("../components/juego/juegoState.js"),
        $.getScript("../components/juego/endState.js"),
        $.getScript("../components/juego/bootState.js")).then(function() {
            bootStateExec(usuario);
        });
}