
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient; // V 3.2.10

//var assert = require('assert');
var exp = require("express");
var bodyParser = require('body-parser');

var modelo = require("./servidor/modelo.js");

var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host; // TODO: Independizar completamente la configuración
var port = config.port;
var app = exp();

var url = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';
var juego;
var db;

//app.use(app.router);
app.use(exp.static(__dirname + "/client"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/**
 * Rutas de la app
 */

app.get("/", function (request, response) {
	var contenido = fs.readFileSync("./client/components/inicio/inicio.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.post('/crearUsuario', function (request, response) {
	var nombre = request.body.nombre;
	var password = request.body.password;

	var usuario = new modelo.Usuario(nombre, password);
	insertarUsuario(usuario);

	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});

app.post('/editarUsuario', function (request, response) {

	var usuario = new modelo.Usuario(request.body.nombre, request.body.password);
	editarUsuario(usuario, callback);
	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else {
			response.send(doc);
		}
	}
});

app.post('/borrarUsuario', function (request, response) {

	borrarUsuario(request.body.nombre, callback);
	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else {
			response.status(204).send('Usuario borrado');
		}
	}
});

app.post('/autenticarse', function (request, response) {
	var nombre = request.body.nombre;
	var password = request.body.password;

	cargarUsuario(nombre, callback);

	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else if (doc) {
			if (doc.password == password) {
				this.juego = new modelo.Juego();
				this.juego.agregarNivel(new modelo.Nivel("1"));
				this.juego.agregarUsuario(doc); /** PODRIA CAMIAR EN crear */

				response.send(this.juego);
			} else {
				response.status(401).send('Error de contraseña.');
			}
		} else {
			response.status(404).send('Usuario no encontrado');
		}
	}
});

app.get('/estadistica', function (request, response) {
	var contenido = fs.readFileSync("./client/components/estadistica/estadistica.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.get('/nivelCompletado'), function(request,response) {
	var tiempo = request.params.tiempo
	//update mongo
}

/**
 * Lanzar servidor
 */

console.log("Servidor escuchando en el puerto " + port);
app.listen(process.env.PORT || 1338);

MongoClient.connect(url, conexion);
function conexion(err, base) {
	db = base;
}

/*******************************
 * Funciones de Mongo DB       *
 *******************************/

/**
 * Insertar usuario
 */
function insertarUsuario(usuario) {
	db.collection('usuarios').insertOne(usuario, callback);
	function callback(err, r) {
	}
}

/**
 * Cargar usuario
 */
function cargarUsuario(nombre, callback) {
	db.collection('usuarios').findOne({ 'nombre': nombre }, cargarUsuariofindOneCallback);
	function cargarUsuariofindOneCallback(err, r) {
		callback(err, r);
	}
}

/**
 * Editar usuario
 */
function editarUsuario(usuario, callback) {
	console.log("Edicion del usuaro nombre:" + usuario.nombre);
	db.collection('usuarios').findOneAndUpdate({ 'nombre': usuario.nombre }, { $set: { 'password': usuario.password } }, { returnOriginal: false }, findOneAndUpdateCallback);
	function findOneAndUpdateCallback(err, r) {
		console.log("Resultado nueva edicion");
		console.log(r);
		callback(err, r.value);
	}
}

/**
 * Borrar usuario
 */
function borrarUsuario(nombre, callback) {
	console.log("Borrado del usuario nombre:" + nombre);
	db.collection('usuarios').deleteOne({ 'nombre': nombre }, deleteOneCallback);
	function deleteOneCallback(err, r) {
		console.log(r);
		callback(err, r);
	}
}

// Gallud ***************************************************************************************
/** Persistencia estadisticas */



/*Carga niveles desde JSON */

app.get('/pedirNivel/:uid', function (request, response) {
	var uid = request.params.uid;
	var usuario = juego.obtnerUsuario(uid);
	var json = { 'nivel': -1 }
	/** To be continued..... */
});

/* Ejemplo Gallud */
app.put("/actualizarUsuario", function (request, response) {
	//var uid=request.params.uid;
	//var email=request.body.email;
	var uid = request.body.uid;
	//var nombre=request.body.nombre;
	//var password=request.body.newpass;
	//var nivel=parseInt(request.body.nivel);
	var json = { 'email': undefined };
	var usu = juego.obtenerUsuario(uid);
	var usuario = comprobarCambios(request.body, usu);
	usuariosCol.update({ _id: ObjectID(uid) }, usuario, function (err, result) {
		console.log(result);
		if (result.result.nModified == 0) {
			console.log("No se pudo actualizar");
			response.send(json);
		}
		else {
			usuariosCol.find({ _id: ObjectID(uid) }).toArray(function (error, usr) {
				if (!error) {
					if (usr.length != 0) {
						json = usr[0];
					}
				}
				console.log("Usuario modificado");
				console.log(json);
				response.send(json);
			});
		}
	});
});
function comprobarCambios(body, usu) {
	if (body.email != usu.email && body.email != "") {
		usu.email = body.email;
	}
	if (body.newpass != usu.password && body.newpass != "") {
		usu.password = body.newpass;
	}
	if (body.nombre != usu.nombre && body.nombre != "") {
		usu.nombre = body.nombre;
	}
	return usu;
}