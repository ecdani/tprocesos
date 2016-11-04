
//$.ajaxSetup({ cache: false, async: true });



$('.enlaceLogout').on('click', logout);
$('.enlaceCreacion').on('click', mostrarCreacion);
$('.enlaceAutenticacion').on('click', mostrarAutenticacion);
$('.enlaceEdicion').on('click', mostrarEdicion);

checkCookie();


//.toggleClass( "active" )
function checkCookie() {
  var usuario = $.cookie("usuario");
  if (usuario) {
    usuario = $.parseJSON(usuario)
    autenticarse(usuario.nombre, usuario.password);
  } else {
    $('#control').load('../components/inicio/intro.html',function(){
      $('#enlaceCreacion').on('click', mostrarCreacion);
      $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    });
    console.log("No cookie");
  }
}


function mostrarAutenticacion() {
  $.when(
    $('#control').load('../components/login/login.html'),
    $.getScript("../components/login/login.js")
  ).then(function () {
    loginExec();
  });
}

function mostrarCreacion() {
  $.when(
    $('#control').load('../components/creacion/creacion.html'),
    $.getScript("../components/creacion/creacion.js")
  ).then(function () {
    creacionExec();
  });
}

