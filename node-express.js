
var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp();
//var MongoClient= require("mongodb"); // V 3.2.10
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');

var modelo = require("./servidor/modelo.js");
var juego;
var usuariosCol;

//app.use(app.router);
app.use(exp.static(__dirname +"/client"));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get('/crearUsuario/:nombre',function(request,response){
	var usuario = new modelo.Usuario(request.params.nombre);
	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});

app.get('/estadistica',function(request,response){
	var contenido=fs.readFileSync("./estadistica.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});


console.log("Servidor escuchando en el puerto "+port);
app.listen(process.env.PORT || 1338);
//app.listen(1338,'localhost');




// Connection URL
var url = 'mongodb://tprocesos:tprocesos@localhost:27017?authMechanism=SCRAM-SHA-1&authSource=myprojectdb';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

    db.collection('inserts').insertOne({a:1}, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);


  db.close();
});



var db = new mongo.Db("usuarioscn", new mongo.Server("127.0.0.0","27017",{}));

db.open(function(error){
	console.log("conectado a Mongo: usuarioscn");
	db.collection("usuarios", function(err,col){
		console.log("tenemos la colección");
		usuariosCol=col;
	});
});

insertar({nombre:"Pepe",email:"pe@pe.com",clave:"pepe"});

function insertar(usu){
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
		}
	});
}