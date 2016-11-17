
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


function Usuario() {
    this.nombre = '';
    this.password = ''; // Debería cifrarse
    this.scoremaximo = 0;
    this.partida = {};

    this.autenticarse = function (done, fail) {
        $.post("/autenticarse", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    this.crear = function (done, fail) {
        if (this.nombre == "") {
            this.nombre = "jugador";
        }
        $.post("/crearUsuario", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    this.editar = function (done, fail) {
        $.post("/editarUsuario", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    this.borrar = function (done, fail) {
        $.post("/borrarUsuario", {
            nombre: this.nombre
        }).done(done).fail(fail);
    }
}
/*Usuario.prototype.borrar = function () { borrarUsuario(this); };
function borrarUsuario(this, done, fail) {
    $.post("/borrarUsuario", {
        nombre: this.nombre
    }).done(done).fail(fail);
}*/

function failBorrar(jqXHR, textStatus, errorThrown) {
    switch (jqXHR.status) {
        case 500:
            console.log(jqXHR);
            $("#divCheckPasswordMatch").html("Error en el servidor.");
            break;
        default:
            console.log(jqXHR);
            $("#divCheckPasswordMatch").html("Error indeterminado.");
    }
}


var Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new Usuario();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


function failEditar(jqXHR, textStatus, errorThrown) {
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
}

function doneEditar(data, status) {
    console.log('El usuario que llega de la edicion:')
    console.log(data);
    $.cookie("usuario", JSON.stringify(data));
    $("#divCheckPasswordMatch").html("Usuario actualizado.");
}


/**
 * Funcionalidad en caso de fallo de la autenticacion.
 */
function failAutenticarse(jqXHR, textStatus, errorThrown) {
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
}

/**
 * Funcionalidad posterior a autenticarse. y a la creación
 */
function doneAutenticarse(juego, status) {
    /*console.log("Exito Autenticacion");
    console.log("Entrando en callback Autenticarse");
    console.log(status);*/

    //var usuario = juego.usuarios[0];

    $('.enlaceCreacion').hide();
    $('.enlaceAutenticacion').hide();
    $('.enlaceLogout').show();
    $('.enlaceEdicion').show();

    $.cookie("usuario", JSON.stringify(Singleton.getInstance()));

    mostrarJuego();
}

function failCrearUsuario(jqXHR, textStatus, errorThrown) {
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
}

/**
 * Logout
 */
function logout() {
    if (!(game.world === null)) {
        game.destroy();
    };
    $.removeCookie("usuario");
    mostrarIntro();
    $('#status').empty();
    $('.enlaceLogout').hide();
    $('.enlaceEdicion').hide();
    $('.enlaceCreacion').show();
    $('.enlaceAutenticacion').show();
}

