
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
        $('#emailBtn').prop("disabled", true);
        $("#divCheckPasswordMatch").html("Las contraseñas no coinciden.");
    } else {
        $('#emailBtn').prop("disabled", false);
        $("#divCheckPasswordMatch").html("Las contraseñas coinciden");
    }
}

/**
 * Objeto proxy que representa un usuario en el cliente.
 */
function Usuario() {
    this.nombre = '';
    this.password = ''; // Debería cifrarse
    this.email = '';
    this.token = null;
    this.segundos = [];
    this.score = '?';
    this.partida = {};

    /**
     * Comprueba si este usuario existe en mongo.
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.autenticarse = function (done, fail) {
        $.post("/autenticarse", {
            email: this.email,
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
            password: this.password,
            email: this.email
        }).done(done).fail(fail);
    };

    /**
     * Actualiza el usuario de mongo con los datos propios actuales
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.editar = function (done, fail) {
        $.post("/editarUsuario", {
            email: this.email,
            password: this.password,
            nombre: this.nombre
        }).done(done).fail(fail);
    };

    /**
     * Se elimina el usuario de mongo.
     * @param done Función de callback en caso de éxito de la operación
     * @param fail Función de callback en caso de fracaso de la operación
     */
    this.borrar = function (done, fail) {
        $.post("/borrarUsuario", {
            email: this.email
        }).done(done).fail(fail);
    };

    /**
     * Carga el usuario desde la sesión en el servidor
     */
    this.loadSession = function (done,fail) {
        $.get("/getUsuario", {
            email: this.email
        }).done(function (data, status) {
            console.log("RECUPERANDO CON LOAD SESSION");
            console.log(data);
            this.nombre = data.nombre;
            this.email = data.email;
            this.segundos = data.segundos;
            this.password = data.password;
            this.score = data.score;
            this.partida = data.partida;
            $.cookie("usuario", JSON.stringify(this));
            //done(data,status);
        }).done(done).fail(fail);
    };

    /**
     * Carga de la cookie de usuario el usuario.
     */
    this.loadCookie = function () {
        var cookie = $.cookie("usuario");
        if (cookie) {
            pseudoUsuario = $.parseJSON(cookie);
            this.nombre = pseudoUsuario.nombre;
            this.email = pseudoUsuario.email;
            this.segundos = pseudoUsuario.segundos;
            this.password = pseudoUsuario.password;
            this.score = pseudoUsuario.score;
            this.partida = pseudoUsuario.partida;
            err = this.autenticarse(doneAutenticarse, failGenerico);
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
 * Funcionalidad posterior a autenticarse. y a la creación
 */
function doneAutenticarse(juego, status) {

    $('.enlaceCreacion').hide(); //.toggleClass( "active" )
    $('.enlaceAutenticacion').hide();
    $('.enlaceLogout').show();
    $('.enlaceEdicion').show();
    console.log("Ejecutando doneAutenticarse");
    usuario = Singleton.getInstance();
    usuario.loadSession(function(data, status){},failGenerico);

    mostrarJuego();
}

function failGenerico(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    $("#autenticacionInfo").html(jqXHR.responseText);
    return jqXHR;
}