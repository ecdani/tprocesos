
var url = "http://127.0.0.1:1338/";

//Funciones que modifican el index


$('#btnRegistro').on('click', function () {
  mostrarRegistro();
});

$('#enlaceAutenticacion').on('click', function () {
  mostrarAutenticacion();
});

function mostrarAutenticacion() {
  var nombre = "", password = "";
  $('#control').empty();
  //$('#control').removeClass('cover');
  //$('#control').addClass('container');

  $('#control').load('../autenticacion.html', funcionalidadAutenticacion);

  function funcionalidadAutenticacion() {
    $('#nombreBtn').on('click', function () {

      nombre = $('#nombre').val();
      password = $('#password').val();
      //console.dir(nombre);
      autenticarse(nombre, password);
      $('#control').empty();

    });
  }
}

function mostrarRegistro() {
  //$('#cabecera').remove();
  var nombre = "", password = "";
  $('#control').empty();
  //$('#control').removeClass('cover');
  //$('#control').addClass('container');

  $('#control').load('../registro.html', funcionalidadRegistro);

  function funcionalidadRegistro() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function () {

      nombre = $('#nombre').val();
      password = $('#password').val();
      //console.dir(nombre);
      crearUsuario(nombre, password);
      $('#control').empty();

    });
  }
}

function checkPasswordMatch() {
  var password = $("#password").val();
  var confirmPassword = $("#validarpassword").val();

  if (password != confirmPassword) {
    $('#nombreBtn').prop("disabled", true);
    $("#divCheckPasswordMatch").html("Las contraseñas no coinciden.");
  } else {
    $('#nombreBtn').prop("disabled", false);
    $("#divCheckPasswordMatch").html("Las constraseñas coinciden");
  }

}

function mostrarInfoJugador(datos) {
  $('#datos').remove();
  $('#cabecera').append('<div id="datos">Nombre: ' + datos.nombre + ' Nivel: ' + datos.nivel + '</div>');
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre, password) {
  if (nombre == "") {
    nombre = "jugador";
  }
  $.post("/crearUsuario", {
    nombre: nombre,
    password: password
  },
    function (data, status) {
      //console.log(data);
      juego = data;
      usuario = juego.usuarios[0];
      game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', { preload: preload, create: create, update: update });
      informacionUsuario(usuario);
    });
}

function autenticarse(nombre, password) {

  $.post("/autenticarse", {
    nombre: nombre,
    password: password
  },
    function (data, status) {
      //console.log(data);
      juego = data;
      usuario = juego.usuarios[0];
      game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', { preload: preload, create: create, update: update });
      informacionUsuario(usuario);
    });
}

function informacionUsuario(usuario) {
  $('#status').show();
  console.dir(usuario);
  $('#nivel').html(usuario.nivel)
  $('#inombre').html(usuario.nombre)
  $('#vidas').html(usuario.vidas)
}