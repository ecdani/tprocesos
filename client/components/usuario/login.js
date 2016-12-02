
/**
 * Función a ejecutar al cargar la pantalla de login
 */
function loginExec() {
    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.autenticarse(doneAutenticarse,failAutenticarse);
    });

    $('#mailBtn').on('click', function (event) {
        $.get("/confirmarCuenta").done(function(res){
            console.log("ko mail");
            console.log(res);
        }).fail(function(){
            console.log("fallo mail");
            console.log(res);
        });
    });
}