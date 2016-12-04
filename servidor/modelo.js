function Juego() {
    this.nombre = "Niveles";
    this.niveles = [];
    this.usuarios = [];
    this.agregarNivel = function (nivel) {
        this.niveles.push(nivel);
    }
    this.agregarUsuario = function (usuario) {
        this.usuarios.push(usuario);
    }
}

function Nivel(num) {
    this.nivel = num;
}

function Usuario(nombre,password,email) {
    this.nombre = nombre;
    this.password = password; // Debería cifrarse
    this.email = email;
    this.scoremaximo = 0;
    this.partida = {}
    this.token = 0;
    this.enabled = false;
    this.crearToken = function() {
        this.token = Math.random();
    };
}

function Partida(){
    this.nivel = 1;
    this.vidas = 3;
}

module.exports.Juego = Juego;
module.exports.Nivel = Nivel;
module.exports.Usuario = Usuario;