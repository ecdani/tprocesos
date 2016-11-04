
$.ajaxSetup({ cache: true });

checkCookie();

$('#btnRegistro').on('click', mostrarRegistro);

$('.enlaceAutenticacion').on('click', mostrarAutenticacion);


function checkCookie() {
  var usuario = $.cookie("usuario");

  if (usuario) {
    usuario = $.parseJSON(usuario)
    autenticarse(usuario.nombre, usuario.password);
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



