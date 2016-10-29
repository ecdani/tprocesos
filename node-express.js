
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient; // V 3.2.10

var assert = require('assert');
var exp = require("express");
var bodyParser = require('body-parser');

var modelo = require("./servidor/modelo.js");

var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host; // TODO: Independizar completamente la configuración
var port = config.port;
var app = exp();

var url = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';
var juego;
var usuariosCol;

//app.use(app.router);
app.use(exp.static(__dirname + "/client"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/**
 * Rutas de la app
 */

app.get("/", function (request, response) {
	var contenido = fs.readFileSync("./index.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.post('/crearUsuario', function (request, response) {
	var nombre = request.body.nombre;
	var password = request.body.password;

	var usuario = new modelo.Usuario(nombre);
	insertarUsuario(usuario, password);

	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
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
				this.juego.agregarUsuario(doc.usuario);
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
	var contenido = fs.readFileSync("./estadistica.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});


/**
 * Lanzar servidor
 */

console.log("Servidor escuchando en el puerto " + port);
app.listen(process.env.PORT || 1338);


/**
 * Funciones de Mongo DB
 */

function insertarUsuario(usuario, password) {
	MongoClient.connect(url, conexion);
	function conexion(err, db) {
		//assert.equal(null, err);

		db.collection('usuarios').insertOne({ usuario: usuario, password: password }, callback);
		function callback(err, r) { // Está anidada, para poder acceder a db.
			//assert.equal(null, err);
			//assert.equal(1, r.insertedCount);
			db.close();
		}
	}
}

function cargarUsuario(nombre, callback) {
	function conexion(err, db) {
		//assert.equal(null, err);
		function findOneCallback(err, r) {
			//assert.equal(null, err);
			callback(err, r);
			db.close();
		}
		db.collection('usuarios').findOne({ 'usuario.nombre': nombre }, findOneCallback);
	}
	MongoClient.connect(url, conexion);
}
