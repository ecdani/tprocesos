
var fs = require("fs");
var exp = require("express");
var mailer = require('express-mailer');
var bodyParser = require('body-parser');

var session = require('express-session');
var modelo = require("./servidor/modelo.js");

var app = exp();
var juego;

var sess;

//app.use(app.router);
app.use(exp.static(__dirname + "/client"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
	secret: '8923j8deyddalxi27zzz81M19us',
	resave: true,
	saveUninitialized: true
}));

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

app.get("/", function (req, res) {
	var contenido = fs.readFileSync("./client/components/inicio/inicio.html");
	res.setHeader("Content-type", "text/html");
	res.send(contenido);
});

app.post('/crearUsuario', function (req, res) {
	//console.log(req.body);
	var usuario = req.session.usuario;
	usuario = new modelo.Usuario();
	usuario.nombre = req.body.nombre;
	usuario.password = req.body.password;
	usuario.email = req.body.email;

	usuario.crearToken();
	usuario.insertar();

	app.mailer.send('confirmacionCuenta', {
		to: usuario.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
		subject: 'Test Email', // REQUIRED.
		usuario: usuario // All additional properties are also passed to the template as local variables.
	}, function (err) {
		if (err) {
			// handle error
			console.log(err);
			res.status(500).send('There was an error sending the email');
			return;
		}
		res.status(200).send('Email de confirmación enviado');
	});
});

app.get("/confirmarCuenta/:email/:token", function (req, res) {
	console.log("Confirmando cuenta...")
	//var email = req.params.email;
	var token = req.params.token;

	var usuario = req.session.usuario;
	usuario = new modelo.Usuario();
	usuario.email = req.params.email;
	usuario.cargar(callback);

	function callback(err, doc) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else if (doc) {
			//console.log(usuario);
			usuario.validar(token, doneValidar, failValidar);
		} else {
			res.status(404).send('Usuario no encontrado');
		}
	}

	function doneValidar(err, doc) {
		req.session.usuario = usuario;
		var contenido = fs.readFileSync("./client/components/inicio/inicioValidado.html");
		res.setHeader("Content-type", "text/html");
		res.send(contenido);
	}

	function failValidar(err, doc) {
		res.status(401).send('Error de token.');
	}

});

app.get('/getUsuario', function (req, res) {
	console.log("Obteniendo cuenta...")
	//var email = req.params.email;
	res.status(200).send(req.session.usuario);
	//var usuario = req.session.usuario;
	//usuario = new modelo.Usuario();
	//usuario.email = req.params.email;
	//usuario.cargar(callback);

});

app.post('/editarUsuario', function (req, res) {
	console.log("Mostrando la sesion en la petición de edición de usuario:");
	console.log(req.session);
	console.log("Mostrando el req.body:");
	console.log(req.body);
	//var usuario = req.session.usuario;
	usuario = new modelo.Usuario();
	usuario.loadSession(req.session.usuario);

	usuario.nombre = req.body.nombre;
	usuario.password = req.body.password;
	usuario.email = req.body.email;

	usuario.editar(callback);
	function callback(err, doc) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else {
			req.session.usuario = usuario;
			res.send(doc);
		}
	}
});

app.post('/borrarUsuario', function (req, res) {
	usuario = new modelo.Usuario();
	usuario.loadSession(req.session.usuario);

	usuario.borrar(callback);
	function callback(err, doc) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else {
			res.status(204).send('Usuario borrado');
		}
	}
});

app.post('/autenticarse', function (req, res) {
	req.session.usuario = new modelo.Usuario();
	var usuario = req.session.usuario;

	usuario.email = req.body.email;
	//var email = req.body.email;
	var password = req.body.password;

	usuario.cargar(callback);

	function callback(err, doc) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else if (doc) {
			if (doc.password == password) {
				if (doc.enabled == true) {
					this.juego = new modelo.Juego();
					this.juego.agregarNivel(new modelo.Nivel("1"));
					this.juego.agregarUsuario(doc); /** PODRIA CAMIAR EN crear */

					res.status(200).send(this.juego);
				} else {
					res.status(401).send('Usuario no validado aún. Por favor revise su correo y confirme la cuenta.');
				}
			} else {
				res.status(401).send('Error de contraseña.');
			}
		} else {
			res.status(404).send('Usuario no encontrado');
		}
	}
});

app.get('/estadistica', function (req, res) {
	var contenido = fs.readFileSync("./client/components/estadistica/estadistica.html");
	res.setHeader("Content-type", "text/html");
	res.send(contenido);
});

app.get('/estadistica.json', function (req, res) {
	usuarios = new modelo.Usuarios();
	usuarios.getEstadistica(callback);

	function callback(err, docs) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else if (docs) {
			console.log("LA SALIDA DE ESTADISTICA:");
			console.log(docs);
			res.send(docs);
				/*if (doc.enabled == true) {
					this.juego = new modelo.Juego();
					this.juego.agregarNivel(new modelo.Nivel("1"));
					this.juego.agregarUsuario(doc);

					res.status(200).send(this.juego);
				} else {
					res.status(401).send('Usuario no validado aún. Por favor revise su correo y confirme la cuenta.');
				}*/
		} else {
			res.status(404).send('Estadistica no encontrada');
		}
	}
	
});

app.post('/nivelCompletado', function (req, res) {
	var usuario = new modelo.Usuario();
	usuario.loadSession(req.session.usuario);
	//var estadistica = 
	//usuario.nombre = req.body.victoria;
	console.log("Registrando nivel completado");

	console.log("Es una victoria");
	console.log(usuario);
	console.log(req.body);
	if (usuario.segundos[req.body.nivel] > parseInt(req.body.segundos) || usuario.segundos[parseInt(req.body.nivel)] == -1) {
		console.log("Reasigno segundos" + req.body.segundos);
		usuario.segundos[req.body.nivel] = parseInt(req.body.segundos);
		usuario.score = 0;
		for ( i = 0; i < usuario.segundos.length; i++ ) {
      		usuario.score += usuario.segundos[i];
   		}
	}

	usuario.editar(callback);
	function callback(err, doc) {
		if (err) {
			res.status(500).send('Error en el servidor.');
		} else {
			req.session.usuario = usuario;
			res.send(doc);
		}
	}
	//usuario.segundos[req.body.nivel] = req.body.segundos;
	//usuario.nombre = req.body.nivel;


	//var tiempo = req.params.tiempo
	//update mongo
});

/**
 * Lanzar servidor
 */

console.log("Servidor escuchando en el puerto " + 1338);
app.listen(process.env.PORT || 1338);

