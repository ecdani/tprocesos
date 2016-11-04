
$.ajaxSetup({ cache: false, async: true });


$('.enlaceRegistro').on('click', mostrarRegistro);

$('.enlaceAutenticacion').on('click', mostrarAutenticacion);

checkCookie();


function checkCookie() {
  var usuario = $.cookie("usuario");

  if (usuario) {
    usuario = $.parseJSON(usuario)
    autenticarse(usuario.nombre, usuario.password);
  } else {
    console.log("No cookie");
    $('#control').load('../components/inicio/intro.html');
  }
}


function mostrarAutenticacion() {
  //var nombre = "", password = "";
  //$('#control').empty();
  $.when(
    $('#control').load('../components/login/login.html'),
    $.getScript("../components/login/login.js")
  ).then(function () {
    loginExec();
  });


}

function mostrarRegistro() {
  // var nombre = "", password = "";
  //$('#control').empty();
  $.when(
    $('#control').load('../components/creacion/creacion.html'),
    $.getScript("../components/creacion/creacion.js")
  ).then(function () {
    creacionExec();
  });

}



