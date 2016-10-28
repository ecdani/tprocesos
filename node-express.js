
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;/* // V 3.2.10
var f = require('util').format;*/
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


app.get("/", function (request, response) {
	var contenido = fs.readFileSync("./index.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

/*app.get('/crearUsuario/:nombre', function (request, response) {
	var usuario = new modelo.Usuario(request.params.nombre);
	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});*/

app.post('/crearUsuario', function (request, response) {
	//console.log(request);
	var nombre = request.body.nombre;
	var password = request.body.password;

	var usuario = new modelo.Usuario(nombre);
	insertarUsuario(usuario,password);
	
	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});

app.post('/autenticarse', function (request, response) {
	//console.log(request);
	var nombre = request.body.nombre;
	var password = request.body.password;

	var doc = cargarUsuario(nombre);
	console.log(doc);
	if (doc.password == password) {
		this.juego = new modelo.Juego();
		this.juego.agregarNivel(new modelo.Nivel("1"));
		this.juego.agregarUsuario(usuario);
		response.send(this.juego);
	} else {
		response.status(401).send('Usuario no encontrado.');
	}

	
	/*this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(doc.usuario);
	response.send(this.juego);*/
});

app.get('/estadistica', function (request, response) {
	var contenido = fs.readFileSync("./estadistica.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});


console.log("Servidor escuchando en el puerto " + port);
app.listen(process.env.PORT || 1338);
//app.listen(1338,'localhost');






function insertarUsuario(usuario,password) {
	MongoClient.connect(url, conexion);
	function conexion(err, db) {
		assert.equal(null, err);

		db.collection('usuarios').insertOne({usuario:usuario,password:password}, callback);
		function callback(err, r) { // Está anidada, para poder acceder a db.
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			db.close();
		}
	}
}


function cargarUsuario(nombre) {
	var resultado = {};
	
	function conexion(err, db) {
		assert.equal(null, err);
		//console.log(nombre);
		function callback(err, r) { // Está anidada, para poder acceder a db.
			assert.equal(null, err);
			//console.log(err);
			//console.log(r);
			db.close();
			resultado = r;
		}
		db.collection('usuarios').findOne({'usuario.nombre':nombre}, callback);
	}
	resultado = MongoClient.connect(url, conexion);
	console.log(resultado);
	return resultado;
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