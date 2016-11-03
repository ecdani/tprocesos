


$('#btnRegistro').on('click', mostrarRegistro);

$('.enlaceAutenticacion').on('click', mostrarAutenticacion);

checkCookie();

function checkCookie() {
  var usuario = $.cookie("usuario");
  
  if (usuario) {
    usuario = $.parseJSON( usuario );
    autenticarse(usuario.nombre, usuario.password);
  } /*else {
    autenticarse(usuario.nombre, usuario.password);
  }*/
}



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
      //$('#control').empty();

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

function mostrarEdicion() {
  //$('#cabecera').remove();
  var nombre = "", password = "";
  $('#control').empty();
  //$('#control').removeClass('cover');
  //$('#control').addClass('container');

  $('#control').load('../edicionUsuario.html', funcionalidadEdicion);

  function funcionalidadEdicion() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function () {

      nombre = $('#nombre').val();
      password = $('#password').val();
      //console.dir(nombre);
      editarUsuario(nombre, password);
      //$('#control').empty();

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
    $("#divCheckPasswordMatch").html("Las contraseñas coinciden");
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
      callbackAutenticarse(data,status);
    }).fail(function (jqXHR, textStatus, errorThrown) {
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

function autenticarse(nombre, password) {
  console.log("nombre"+nombre);
  console.log("password"+password);
  $.post("/autenticarse", {
    nombre: nombre,
    password: password
  }, function (data, status) {
      callbackAutenticarse(data,status);
    }
  ).fail(function (jqXHR, textStatus, errorThrown) {
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
    }
  });
}

function callbackAutenticarse(data,status) {
  $('#control').empty();
    console.log(status);
    juego = data;
    usuario = juego.usuarios[0];
    //game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', { preload: preload, create: create, update: update });

    $('.enlaceAutenticacion').html('Editar cuenta');
    $(".enlaceAutenticacion").unbind();

    $('.enlaceAutenticacion').on('click', mostrarEdicion);

    $.cookie("usuario", JSON.stringify(usuario));

    game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', bootState);
    //game.load.script('bootState', 'js/bootState.js');
    //game.state.add('bootState', bootState);
    //game.state.start('bootState');
    /*game.state.add('Main', Main);
    game.state.start('Main');*/


    informacionUsuario(usuario);
}

function editarUsuario(nombre, password) {

  $.post("/editarUsuario", {
    nombre: nombre,
    password: password
  },
    function (data, status) {
      //console.log(data);
      $("#divCheckPasswordMatch").html("Usuario actualizado.");

    }).fail(function (jqXHR, textStatus, errorThrown) {
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




function informacionUsuario(usuario) {
  $('#status').show();
  console.dir(usuario);
  $('#nivel').html(usuario.nivel)
  $('#inombre').html(usuario.nombre)
  $('#vidas').html(usuario.vidas)
}