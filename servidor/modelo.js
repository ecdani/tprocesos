function Juego() {
    this.nombre="Niveles";
    this.niveles=[];
    this.usuarios=[];
    this.agregarNivel=function(nivel){
        this.niveles.push(nivel);
    }
    this.agregarUsuario=function(usuario){
        this.usuarios.push(usuario);
    }
}

function Nivel(num){
    this.nivel = num;
}

function Usuario(nombre){
    this.nombre=nombre;
    this.nivel= 1;
    this.vidas = 3;
}

module.exports.Juego = Juego;
module.exports.Nivel = Nivel;
module.exports.Usuario = Usuario;