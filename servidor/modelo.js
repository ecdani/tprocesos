var exports = module.exports = {};

var MongoClient = require('mongodb').MongoClient; // V 3.2.10
var db;
var url = 'mongodb://tprocesos:tprocesos@ds135577.mlab.com:35577/procesos-gallud';

MongoClient.connect(url, conexion);
function conexion(err, base) {
    db = base;
}

/**
 * Objeto colección de usuarios
 */
exports.Usuarios = function () {

    /**
     * Obtener ranking
     */
    this.getEstadistica = function (callback) {
        db.collection('usuarios').find({}).sort({ 'score': 1 }).toArray(function (err, docs) {
            for (i = 0; i < docs.length; i++) {
                docs[i].puesto = i + 1;
                docs[i].score1 = docs[i].segundos[0];
                docs[i].score2 = docs[i].segundos[1];
                docs[i].score3 = docs[i].segundos[2];
                docs[i].score4 = docs[i].segundos[3];
                docs[i].score5 = docs[i].segundos[4];
            }
            callback(err, docs);
        });
    };
}

/**
 * Objeto usuario del servidor
 */
exports.Usuario = function () {
    this.nombre = '';
    this.password = ''; // Debería cifrarse
    this.email = '';
    this.segundos = ['?', '?', '?', '?', '?'];
    this.score = '?';
    this.partida = {};
    this.token = 0;
    this.enabled = false;

    /**
     * Crear token
     */
    this.crearToken = function () {
        this.token = Math.random();
    };

    /**
     * Insertar usuario
     */
    this.insertar = function () {
        db.collection('usuarios').insertOne(this, callback);
        function callback(err, r) {
        };
    };

    /**
     * Validar usuario
     */
    this.validar = function (tk, done, fail) {
        if (this.token == tk) {
            this.enabled = true;
            this.editar(done);
        } else {
            fail();
        }
    }

    /**
     * Cargar usuario
     */
    this.cargar = function (callback) {
        usuario = this;
        db.collection('usuarios').findOne({ 'email': this.email }, cargarUsuariofindOneCallback);
        function cargarUsuariofindOneCallback(err, r) {
            if (!err && (r != null)) {
                usuario.nombre = r.nombre;
                usuario.password = r.password;
                usuario.email = r.email;
                usuario.segundos = r.segundos;
                usuario.score = r.score;
                usuario.partida = r.partida;
                usuario.token = r.token;
                usuario.enabled = r.enabled;
            }
            callback(err, r);
        };
    };
    
    /**
     * Cargar usuario desde sesión
     */
    this.loadSession = function (usuario) {
        this.nombre = usuario.nombre;
        this.password = usuario.password;
        this.email = usuario.email;
        this.segundos = usuario.segundos;
        this.score = usuario.score;
        this.partida = usuario.partida;
        this.token = usuario.token;
        this.enabled = usuario.enabled;
    }

    /**
     * Editar usuario
     */
    this.editar = function (callback) {
        console.log("Edicion del usuario nombre:" + this.nombre);
        db.collection('usuarios').findOneAndUpdate({ 'email': this.email }, this, { returnOriginal: false }, findOneAndUpdateCallback);
        function findOneAndUpdateCallback(err, r) {
            callback(err, r.value);
        };
    };

    /**
     * Borrar usuario
     */
    this.borrar = function (callback) {
        console.log("Borrado del usuario nombre:" + this.nombre);
        db.collection('usuarios').deleteOne({ 'email': this.email }, deleteOneCallback);
        function deleteOneCallback(err, r) {
            callback(err, r);
        };
    };
}

