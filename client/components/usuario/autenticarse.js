
/**
 * Librería de funciones compartidas de 
 * la gestión de usuarios.
 */

/**
 * Singleton de usuario. Se debe usar para asegurar la unicidad del usuario.
 */
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

Singleton.getInstance().loadCookie();


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
 * Objeto proxy que representa un usuario en el cliente.
 */
function Usuario() {
    this.nombre = '';
    this.password = ''; // Debería cifrarse
    this.scoremaximo = 0;
    this.partida = {};

    /**
     * Comprueba si este usuario existe en mongo.
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.autenticarse = function (done, fail) {
        $.post("/autenticarse", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    /**
     * Se crea el usuario en mongo con los datos propios actuales
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.crear = function (done, fail) {
        if (this.nombre == "") {
            this.nombre = "jugador";
        }
        $.post("/crearUsuario", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    /**
     * Actualiza el usuario de mongo con los datos propios actuales
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.editar = function (done, fail) {
        $.post("/editarUsuario", {
            nombre: this.nombre,
            password: this.password
        }).done(done).fail(fail);
    };

    /**
     * Se elimina el usuario de mongo.
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.borrar = function (done, fail) {
        $.post("/borrarUsuario", {
            nombre: this.nombre
        }).done(done).fail(fail);
    };

    /**
     * Carga de la cookie de usuario el usuario.
     */
    this.loadCookie = function() {
        var cookie = $.cookie("usuario");
        if (cookie) {
            pseudoUsuario = $.parseJSON(cookie);
            this.nombre = pseudoUsuario.nombre;
            this.password = pseudoUsuario.password;
            this.scoremaximo = pseudoUsuario.scoremaximo;
            this.partida = pseudoUsuario.partida;
            err = this.autenticarse(doneAutenticarse, failAutenticarse);
            if (err) {
                mostrarInfo();
                console.log("Cookie incorrecta");
                $.removeCookie("usuario");
            }
        } else {
            mostrarIntro();
            console.log("No cookie");
        }
    }
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


/**
 * Funcionalidad posterior a autenticarse. y a la creación
 */
function doneAutenticarse(juego, status) {

    $('.enlaceCreacion').hide(); //.toggleClass( "active" )
    $('.enlaceAutenticacion').hide();
    $('.enlaceLogout').show();
    $('.enlaceEdicion').show();

    $.cookie("usuario", JSON.stringify(Singleton.getInstance()));

    mostrarJuego();
}

/**
 * Funcionalidad en caso de fallo de la autenticacion.
 */
function failAutenticarse(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    switch (jqXHR.status) {
        case 404:
            $("#autenticacionInfo").html("Usuario no encontrado.");
            break;
        case 500:
            $("#autenticacionInfo").html("Error en el servidor.");
            break;
        case 401:
            $("#autenticacionInfo").html("Contraseña incorrecta.");
            break;
        default:
            console.log("Error Autenticacion");
    }
    return jqXHR;
}

/**
 * Funcionalidad en caso de fallo de la creación/registro.
 */
function failCrearUsuario(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    switch (jqXHR.status) {
        case 409:
            $("#divCheckPasswordMatch").html("El nombre de usuario ya existe.");
            break;
        case 500:
            $("#divCheckPasswordMatch").html("Error en el servidor.");
            break;
        default:
    }
}

/**
 * Funcionalidad en caso de fallo del borrado
 */
function failBorrar(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    switch (jqXHR.status) {
        case 500:
            $("#divCheckPasswordMatch").html("Error en el servidor.");
            break;
        default:
            $("#divCheckPasswordMatch").html("Error indeterminado.");
    }
}

/**
 * Funcionalidad en caso de fallo de la edición
 */
function failEditar(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    switch (jqXHR.status) {
        case 409:
            $("#divCheckPasswordMatch").html("El nombre de usuario ya existe.");
            break;
        case 500:
            $("#divCheckPasswordMatch").html("Error en el servidor.");
            break;
        default:
            $("#divCheckPasswordMatch").html("Error indeterminado.");
    }
}