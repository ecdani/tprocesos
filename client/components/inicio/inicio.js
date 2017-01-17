

$('.enlaceLogout').on('click', logout);
$('.enlaceEdicion').on('click', mostrarEdicion);
$('.enlaceCreacion').on('click', mostrarCreacion);
$('.enlaceAutenticacion').on('click', mostrarAutenticacion);
$('.enlaceEstadistica').on('click', mostrarEstadistica);
$('.enlaceInfo').on('click', mostrarInfo);




function mostrarIntro() {
  $('#control').load('../components/inicio/intro.html', function () {
    $('#enlaceCreacion').on('click', mostrarCreacion);
    $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
  });
}

function mostrarInfo() {
  $('#control').load('../components/info/info.html', function () {
  });
}

function mostrarAutenticacion() {
  $.when(
    $('#control').load('../components/usuario/login.html'),
    $.getScript("../components/usuario/login.js")
  ).then(function () {
    loginExec();
  });
}

function mostrarCreacion() {
  //eval("riasa()");
  $.when(
    $('#control').load('../components/usuario/creacion.html'),
    $.getScript("../components/usuario/creacion.js")
  ).then(function () {
    creacionExec();
  });
}

function mostrarEdicion(event) {
  if (!(game.world === null)) {
    game.destroy();
  };
  $.when(
    $('#control').load('../components/usuario/edicion.html'),
    $.getScript("../components/usuario/edicion.js")
  ).then(function () {
    edicionExec();
  });
}

function mostrarEstadistica(event) {

  $('#status').empty();
  $.when(
    $('#control').load('../components/estadistica/estadistica.html'),
    $.getScript("../components/estadistica/estadistica.js")
  ).then(function () {
    estadisticaExec();
    if (typeof game === 'undefined') { } else {
      if (!(game.world === null)) {
        game.destroy();
      };
    }
  });
}

function mostrarJuego() {
  $.when(
    $.getScript("../components/juego/juegoState.js"),
    $.getScript("../components/juego/endState.js"),
    $.getScript("../components/juego/bootState.js")
  ).then(function () {
    bootStateExec();
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
  mostrarIntro();
  $('#status').empty();
  $('.enlaceLogout').hide();
  $('.enlaceEdicion').hide();
  $('.enlaceCreacion').show();
  $('.enlaceAutenticacion').show();
}

