var request = require("request"); // https://www.npmjs.com/package/request
var url='https://tprocesos.herokuapp.com/';
//var url='http://161.67.8.34:5000/';
//var url = 'http://127.0.0.1:1338/'
var headers = {
	//'User-Agent': 'request'
	"User-Agent": "Super Agent/0.0.1",
	'Content-Type': 'application/x-www-form-urlencoded'
}

var MongoClient = require('mongodb').MongoClient; // V 3.2.10
var urlMongo = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';
var db;


console.log("===========================================")
console.log(" Inicio de las pruebas de integracion del API REST:");
console.log(" 1. Crear usuario");
console.log(" 2. Validar usuario");
console.log(" 3. Validar usuario, token incorrecto");
console.log(" 4. Validar usuario, mail incorrecto");
console.log(" 5. Iniciar sesion");
console.log(" 6. Iniciar sesion, clave incorrecta");
console.log(" 7. Iniciar sesion, usuario incorrecto");
console.log(" 8. Editar usuario");
console.log(" 9. Eliminar usuario");
console.log(" URL: " + url);
console.log("========================================== \n")

/**
 * Prueba básica de API de crear un usuario cualquiera
 * @param email un email cualquiera de prueba.
 * @param password contraseña cualquiera
 */
function crearUsuario(email, password) {
	var options = {
		url: url + 'crearUsuario',
		method: 'POST',
		headers: headers,
		form: { email: email, password: password }
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario " + email + " con clave " + password);

	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		console.log("	body:                " + body);
		confirmarCuenta(email, password)
	});
}

/**
 * Prueba básica de API de validación del usuario, estos códigos se envian al mail
 * Aquí los recogeremos y sólo se probará la invocación de la URL de validación
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function confirmarCuenta(email, password) {
	console.log("---------------------------------------------");
	console.log("Recuperando usuario...");
	db.collection('usuarios').findOne({ 'email': email }, function (err, r) {
		var options = {
			url: url + 'confirmarCuenta/' + email + '/' + r.token,
			method: 'GET',
			headers: headers
			//form: { email: email, password: password }
		}
		console.log(options.url);

		console.log("---------------------------------------------");
		console.log("2. Validación de la cuenta: " + email);

		request(options, function (error, response, body) {
			console.log("	Resultado:");
			console.log("	Error:               " + error);
			console.log("	response.statusCode: " + response.statusCode);
			console.log("	response.Message:    " + response.statusMessage);
			if (body.startsWith('<!doctype html>')) {
				console.log("	body:	El body parece correcto");
				confirmarCuenta2(email, password);
			} else {
				console.log("	body: ¡NO PARECE CORRECTO!");
			}
		});
	});
}

/**
 * Prueba básica de API de validación del usuario, estos códigos se envian al mail
 * Aquí los recogeremos y sólo se probará la invocación de la URL de validación
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function confirmarCuenta2(email, password) {
	console.log("---------------------------------------------");
	console.log("Recuperando usuario...");
	db.collection('usuarios').findOne({ 'email': email }, function (err, r) {
		var options = {
			url: url + 'confirmarCuenta/' + email + '/' + '000000',
			method: 'GET',
			headers: headers
			//form: { email: email, password: password }
		}
		console.log(options.url);

		console.log("---------------------------------------------");
		console.log("3. Validación de la cuenta, token incorrecto: " + email);

		request(options, function (error, response, body) {
			console.log("	Resultado:");
			console.log("	Error:               " + error);
			console.log("	response.statusCode: " + response.statusCode);
			console.log("	response.Message:    " + response.statusMessage);
			if (response.statusCode == 401) {
				console.log("	Test Correcto");
				confirmarCuenta3(email, password)
			} else {
				console.log("	Test incorrecto");
			}
		});
	});
}

/**
 * Prueba básica de API de validación del usuario, estos códigos se envian al mail
 * Aquí los recogeremos y sólo se probará la invocación de la URL de validación
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function confirmarCuenta3(email, password) {
	console.log("---------------------------------------------");
	console.log("Recuperando usuario...");
	db.collection('usuarios').findOne({ 'email': email }, function (err, r) {
		var options = {
			url: url + 'confirmarCuenta/emailincorrecto/' + r.token,
			method: 'GET',
			headers: headers
			//form: { email: email, password: password }
		}
		console.log(options.url);

		console.log("---------------------------------------------");
		console.log("4. Validación de la cuenta, usuario incorrecto: " + email);

		request(options, function (error, response, body) {
			console.log("	Resultado:");
			console.log("	Error:               " + error);
			console.log("	response.statusCode: " + response.statusCode);
			console.log("	response.Message:    " + response.statusMessage);
			if (response.statusCode == 404) {
				console.log("	Test Correcto");
				autenticarse2(r);
			} else {
				console.log("	Test incorrecto");
			}
		});
	});
}

/**
 * Prueba básica de API de inicio de sesión del usuario ya creado
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function autenticarse2(usuario) {
	var options = {
		url: url + 'autenticarse',
		method: 'POST',
		headers: headers,
		form: { email: usuario.email, password: 'passincorrecto' }
	}

	console.log("---------------------------------------------");
	console.log("5. El usuario: " + usuario.email + " intenta iniciar sesion con clave incorrecta");

	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		if (response.statusCode == 401) {
			console.log("	Test correcto");
			autenticarse3(usuario);
		} else {
			console.log("	Test incorrecto");
		}
	});
}

/**
 * Prueba básica de API de inicio de sesión del usuario ya creado
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function autenticarse3(usuario) {
	var options = {
		url: url + 'autenticarse',
		method: 'POST',
		headers: headers,
		form: { email: 'usuarioIncorrecto', password: usuario.password }
	}

	console.log("---------------------------------------------");
	console.log("6. El usuario: " + usuario.email + " intenta iniciar sesion con usuario incorrecto");

	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		if (response.statusCode == 404) {
			console.log("	Test correcto");
			autenticarse(usuario);
		} else {
			console.log("	Test incorrecto");
		}
	});
}


/**
 * Prueba básica de API de inicio de sesión del usuario ya creado
 * @param email de un usuario existente.
 * @param password contraseña del usuario
 */
function autenticarse(usuario) {
	var options = {
		url: url + 'autenticarse',
		method: 'POST',
		headers: headers,
		form: { email: usuario.email, password: usuario.password }
	}

	console.log("---------------------------------------------");
	console.log("7. El usuario: " + usuario.email + " intenta iniciar sesion");

	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		var jsonResponse = JSON.parse(body);
		if (jsonResponse.usuarios[0].email == usuario.email) {
			console.log("	body:	El body parece correcto");
			editarUsuario(usuario, "PepeJuan");
		} else {
			console.log("	body: ¡NO PARECE CORRECTO!");
		}
	});
}

/**
 * Prueba básica de actualizar el nombre del usuario
 * @param objeto usuario a actualizar
 * @param nombre nuevo
 */
function editarUsuario(usuario, nuevoNombre) {
	var options = {
		url: url + 'editarUsuario/',
		method: 'POST',
		headers: headers,
		form: { nombre: nuevoNombre, email: usuario.email, password: usuario.password }
	}
	console.log("-------------------------------------------------------------------");
	console.log("8. El usuario: " + usuario.email + " intenta actualizar el nombre a " + nuevoNombre);
	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);

		var jsonResponse = JSON.parse(body);
		if (jsonResponse.nombre == nuevoNombre) {
			console.log("	body:	El body parece correcto");
			borrarUsuario(usuario);
		} else {
			console.log("	body: ¡NO PARECE CORRECTO!");
		}
	});
}

/**
 * Prueba básica de eliminar el usuario
 * @param objeto usuario a borrar
 */
function borrarUsuario(usuario) {
	var options = {
		url: url + 'borrarUsuario/',
		method: 'POST',
		headers: headers,
		form: usuario
	}
	console.log("---------------------------------------------");
	console.log("9. Se intenta eliminar el usuario: " + usuario.email);
	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		console.log("	body:	             " + body);
		borrarUsuario2(usuario);
	});
}

/**
 * Prueba básica de eliminar el usuario
 * @param objeto usuario a borrar
 */
function borrarUsuario2(usuario) {
	usuario.email = "incorrecto";
	var options = {
		url: url + 'borrarUsuario/',
		method: 'POST',
		headers: headers,
		form: usuario
	}
	console.log("---------------------------------------------");
	console.log("10. Se intenta eliminar un usuario incorrecto ");
	request(options, function (error, response, body) {
		console.log("	Resultado:");
		console.log("	Error:               " + error);
		console.log("	response.statusCode: " + response.statusCode);
		console.log("	response.Message:    " + response.statusMessage);
		console.log("	body:	             " + body);
		console.log("===== Terminada ejecucion de pruebas =====");
	});
}

/**
 * Ejecución de pruebas
 */

MongoClient.connect(urlMongo, conexion);
function conexion(err, base) {
	db = base;
	crearUsuario('pepe@pepe.es', 'pepe');
}

