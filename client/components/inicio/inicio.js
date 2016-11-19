

$('.enlaceLogout').on('click', logout);
$('.enlaceEdicion').on('click', mostrarEdicion);
$('.enlaceCreacion').on('click', mostrarCreacion);
$('.enlaceAutenticacion').on('click', mostrarAutenticacion);



function mostrarIntro() {
  $('#control').load('../components/inicio/intro.html', function () {
    $('#enlaceCreacion').on('click', mostrarCreacion);
    $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
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

function mostrarJuego() {
  $.when(
    $.getScript("../components/juego/juegoState.js"),
    $.getScript("../components/juego/endState.js"),
    $.getScript("../components/juego/bootState.js")
  ).then(function () {
    bootStateExec();
  });
}