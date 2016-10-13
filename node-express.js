
var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp();

var modelo = require("./servidor/modelo.js");
var juego;

//app.use(app.router);
app.use(exp.static(__dirname +"/client"));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get('/crearUsuario/:nombre/',function(request,response){
	var usuario = new modelo.Usuario(request.params.nombre);
	this.juego = new modelo.Juego();
	this.juego.agregarNivel(new modelo.Nivel("1"));
	this.juego.agregarUsuario(usuario);
	response.send(this.juego);
});

console.log("Servidor escuchando en el puerto "+port);
app.listen(process.env.PORT || 1338);

