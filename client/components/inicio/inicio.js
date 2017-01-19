
$('.enlaceLogout').on('click', logout);
$('.enlaceEdicion').on('click', mostrarEdicion);
$('.enlaceCreacion').on('click', mostrarCreacion);
$('.enlaceAutenticacion').on('click', mostrarAutenticacion);
$('.enlaceEstadistica').on('click', mostrarEstadistica);
$('.enlaceInfo').on('click', mostrarInfo);

/**
 * Acciones al mostrar la intro
 */
function mostrarIntro() {
  $('#control').load('../components/inicio/intro.html', function () {
    $('#enlaceCreacion').on('click', mostrarCreacion);
    $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
  });
}

/**
 * Acciones al mostrar la info
 */
function mostrarInfo() {
  $('#control').load('../components/info/info.html', function () {
  });
}

/**
 * Acciones al mostrar la autenticación
 */
function mostrarAutenticacion() {
  $.when(
    $('#control').load('../components/usuario/login.html'),
    $.getScript("../components/usuario/login.js")
  ).then(function () {
    loginExec();
  });
}

/**
 * Acciones al mostrar la creacion
 */
function mostrarCreacion() {
  $.when(
    $('#control').load('../components/usuario/creacion.html'),
    $.getScript("../components/usuario/creacion.js")
  ).then(function () {
    creacionExec();
  });
}

/**
 * Acciones al mostrar la edicion
 */
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

/**
 * Acciones al mostrar el ranking o estadistica
 */
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

/**
 * Acciones al mostrar el juego
 */
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

