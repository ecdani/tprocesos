
var url = "http://127.0.0.1:1338/";

//Funciones que modifican el index


$('#inicio').on('click', function () {
    inicio();
  });

function inicio() {
  mostrarCabecera();
}

function borrarControl() {
  $('#control').remove();
}

function mostrarCabecera() {
  //$('#cabecera').remove();
  var nombre = "";
  $('#control').empty();
  //$('#control').removeClass('cover');
  //$('#control').addClass('container');
  
  $('#control').append('<div id="cabecera"><h2>Para empezar danos un nombre </h2><form class="form-inline"><div class="form-group"><input class="form-control" type="text" id="nombre" placeholder="Introduce tu nombre"></div> <button type="button" id="nombreBtn" class="btn btn-primary">Enviar</button></form></div>');
  $('#nombreBtn').on('click', function () {
    nombre = $('#nombre').val();
    $('#control').empty();
    crearUsuario(nombre);
  });
}

function mostrarInfoJugador(datos) {
  $('#datos').remove();
  $('#cabecera').append('<div id="datos">Nombre: ' + datos.nombre + ' Nivel: ' + datos.nivel + '</div>');
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre) {
  if (nombre == "") {
    nombre = "jugador";
  }
  $.getJSON('/crearUsuario/' + nombre, function (datos) {
    juego =  datos;
		usuario = juego.usuarios[0];
		informacionUsuario(usuario);
		game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', { preload: preload, create: create, update: update });
  });
  //mostrar datos
}

function informacionUsuario(usuario) {
	$('.control-panel').append('<ul id="info"></ul>');
	$('#info').append('<li><i class="fa fa-gamepad fa-3x" aria-hidden="true"></i> <h2> '+usuario.nombre+'</h2></li>');
	$('#info').append('<li><i class="fa fa-star fa-3x" aria-hidden="true"></i><span id="score">0</span></li>');
	$('#info').append('<li><i class="fa fa-trophy fa-3x" aria-hidden="true"></i><span id="nivel">'+usuario.nivel+'</span></li>');
	$('.control-panel').append('<li><div class="vidas"></div>');
	for (i=0;i < usuario.vidas; i++)
		{
			$('.vidas').append('<i class="fa fa-heart fa-3x" aria-hidden="true"></i>');
		}
	
}