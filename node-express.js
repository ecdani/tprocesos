
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;/* // V 3.2.10
var f = require('util').format;*/
var assert = require('assert');
var exp = require("express");

var modelo = require("./servidor/modelo.js");

var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var app = exp();


var juego;
var usuariosCol;

//app.use(app.router);
app.use(exp.static(__dirname + "/client"));

app.get("/", function (request, response) {
	var contenido = fs.readFileSync("./index.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.get('/crearUsuario/:nombre', function (request, response) {
	var usuario = new modelo.Usuario(request.params.nombre);
	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});

app.get('/estadistica', function (request, response) {
	var contenido = fs.readFileSync("./estadistica.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});


console.log("Servidor escuchando en el puerto " + port);
app.listen(process.env.PORT || 1338);
//app.listen(1338,'localhost');




var url = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';

MongoClient.connect(url, insertarUsuario);

function insertarUsuario (err, db) {
	assert.equal(null, err);

	db.collection('usuarios').insertOne({ nombre: "Pepe", email: "pe@pe.com", clave: "pepe" }, insertarUsuarioCallback );

	function insertarUsuarioCallback(err, r) { // Está anidada, para poder acceder a db.
		assert.equal(null, err);
		assert.equal(1, r.insertedCount);
		db.close();
	}
}





/*
function insertarUsuarioCallback (err, r, db) {
		assert.equal(null, err);
		assert.equal(1, r.insertedCount);
		db.close(); // como accedemos a db???
}*/



/*
	var db = new mongo.Db("usuarioscn", new mongo.Server("127.0.0.0", "27017", {}));

	db.open(function (error) {
		console.log("conectado a Mongo: usuarioscn");
		db.collection("usuarios", function (err, col) {
			console.log("tenemos la colección");
			usuariosCol = col;
		});
	});

	insertar({ nombre: "Pepe", email: "pe@pe.com", clave: "pepe" });

	function insertar(usu) {
		usuariosCol.insert(usu, function (err) {
			if (err) {
				console.log("error");
			} else {
				console.log("Nuevo usuario creado");
			}
		});
	}*/