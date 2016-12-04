
var fs = require("fs");
var exp = require("express");
var mailer = require('express-mailer');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient; // V 3.2.10
var modelo = require("./servidor/modelo.js");

var url = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';
var app = exp();
var juego;
var db;

//app.use(app.router);
app.use(exp.static(__dirname + "/client"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mailer.extend(app, {
	from: 'conquistanivelesgallud@gmail.com',
	host: 'smtp.gmail.com', // hostname
	secureConnection: true, // use SSL
	port: 465, // port for secure SMTP
	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
	auth: {
		user: 'conquistanivelesgallud@gmail.com',
		pass: 'chimpokomon'
	}
});

app.set('views', __dirname + '/servidor/mail');
app.set('view engine', 'jade');


/**
 * Rutas de la app
 */

app.get("/", function (request, response) {
	var contenido = fs.readFileSync("./client/components/inicio/inicio.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.post('/crearUsuario', function (request, response) {
	console.log(request.body);
	var usuario = new modelo.Usuario(request.body.nombre, request.body.password, request.body.email);
	usuario.crearToken();
	insertarUsuario(usuario);

	app.mailer.send('confirmacionCuenta', {
		to: usuario.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
		subject: 'Test Email', // REQUIRED.
		usuario: usuario // All additional properties are also passed to the template as local variables.
	}, function (err) {
		if (err) {
			// handle error
			console.log(err);
			response.status(500).send('There was an error sending the email');
			return;
		}
		response.status(200).send('Email de confirmación enviado');
	});
});

app.get("/confirmarCuenta/:email/:token", function (request, response) {
	console.log("Llamada a confirmar cuenta")
	var email = request.params.email;
	var token = request.params.token;

	cargarUsuario(email, callback);

	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else if (doc) {
			if (doc.token == token) {
				doc.enabled = true;
				editarUsuario(doc, callbackHabilitar);
				function callbackHabilitar(err, doc) {
					var contenido = fs.readFileSync("./client/components/inicio/inicioValidado.html");
					response.setHeader("Content-type", "text/html");
					response.send(contenido);
				}
			} else {
				response.status(401).send('Error de token.');
			}
		} else {
			response.status(404).send('Usuario no encontrado');
		}
	}
});

app.post('/editarUsuario', function (request, response) {

	var usuario = new modelo.Usuario(request.body.nombre, request.body.password, request.body.email);
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

	var usuario = new modelo.Usuario(request.body.nombre, request.body.password, request.body.email);

	borrarUsuario(usuario, callback);
	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else {
			response.status(204).send('Usuario borrado');
		}
	}
});

app.post('/autenticarse', function (request, response) {
	var email = request.body.email;
	var password = request.body.password;

	cargarUsuario(email, callback);

	function callback(err, doc) {
		if (err) {
			response.status(500).send('Error en el servidor.');
		} else if (doc) {
			if (doc.password == password) {
				if (doc.enabled == true) {
					this.juego = new modelo.Juego();
					this.juego.agregarNivel(new modelo.Nivel("1"));
					this.juego.agregarUsuario(doc); /** PODRIA CAMIAR EN crear */

					response.status(200).send(this.juego);
				} else {
					response.status(401).send('Usuario no validado aún. Por favor revise su correo y confirme la cuenta.');
				}
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

app.get('/nivelCompletado'), function (request, response) {
	var tiempo = request.params.tiempo
	//update mongo
}

/**
 * Lanzar servidor
 */

console.log("Servidor escuchando en el puerto " + 1338);
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
function cargarUsuario(email, callback) {
	db.collection('usuarios').findOne({ 'email': email }, cargarUsuariofindOneCallback);
	function cargarUsuariofindOneCallback(err, r) {
		callback(err, r);
	}
}

/**
 * Editar usuario
 */
function editarUsuario(usuario, callback) {
	console.log("Edicion del usuario nombre:" + usuario.nombre);
	db.collection('usuarios').findOneAndUpdate({ 'email': usuario.email }, usuario, { returnOriginal: false }, findOneAndUpdateCallback);
	//{ $set: { 'password': usuario.password } }
	function findOneAndUpdateCallback(err, r) {
		console.log("Resultado nueva edicion");
		console.log(r);
		callback(err, r.value);
	}
}

/**
 * Borrar usuario
 */
function borrarUsuario(usuario, callback) {
	console.log("Borrado del usuario nombre:" + usuario.nombre);
	db.collection('usuarios').deleteOne({ 'email': usuario.email }, deleteOneCallback);
	function deleteOneCallback(err, r) {
		console.log(r);
		callback(err, r);
	}
}