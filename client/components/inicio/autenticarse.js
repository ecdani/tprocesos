
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
    }, function(data, status) {
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
        return jqXHR;
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

    $('.enlaceCreacion').hide();
    $('.enlaceAutenticacion').hide();
    $('.enlaceLogout').show();
    $('.enlaceEdicion').show();

    $.cookie("usuario", JSON.stringify(usuario));

    mostrarJuego(usuario);
}

/**
 * Muestra la edición
 */
function mostrarEdicion(event) {
    if (!(game.world  === null)) {
        game.destroy();
    };
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

/**
 * Logout
 */
function logout() {
    if (!(game.world === null)) {
        game.destroy();
    };
    $.removeCookie("usuario");
    $('#control').load('../components/inicio/intro.html', function() {
        $('#enlaceCreacion').on('click', mostrarCreacion);
        $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    });
    $('#status').empty();
    $('.enlaceLogout').hide();
    $('.enlaceEdicion').hide();
    $('.enlaceCreacion').show();
    $('.enlaceAutenticacion').show();
}