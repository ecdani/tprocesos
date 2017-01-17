

/**
 * Función para ejecutar al cargar la pantalla de edición
 * data-url="/estadistica.json"
 */
function estadisticaExec() {
    if (typeof $.cookie('usuario') === 'undefined') {
        //no cookie
        console.log("no hay cookie");
        $('#control3').show();
        $('#control2').hide();
        $('#enlaceCreacion').on('click', mostrarCreacion);
        $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    } else {
        console.log("hay cookie");
        $('#control3').hide();
        //$('#control2').show();
        var usuario = $.cookie("usuario");
        usuario = $.parseJSON(usuario);
        console.log(usuario)
        $('#score1').html(usuario.segundos[0])
        $('#score2').html(usuario.segundos[1])
        $('#score3').html(usuario.segundos[2])
        $('#score4').html(usuario.segundos[3])
        $('#score5').html(usuario.segundos[4])
        $('#scoretotal').html(usuario.score)
    }

    console.log("EJECUTANDO ESTADISTICA");

    $.get('estadistica.json', function (data) {

        /* data = [
             {
                 "id": "bootstrap-table",
                 "name": "526",
                 "score": "122",
             },
             {
                 "id": "bootstrap-table",
                 "name": "526",
                 "score": "122",
             }
         ];*/

        //

        console.log("EJECUTANDO ESTADISTICA2");
        $(function () {
            console.log("EJECUTANDO ESTADISTICA3");
            console.log(data);
            $('#table').bootstrapTable({
                data: data
            });
        });
    });


    $('#nombreBtn').on('click', function (event) {
        event.preventDefault();

        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.email = $('#email').val();
        usuario.editar(doneEditar, failGenerico);

    });

    $('#borrarBtn').on('click', function (event) {
        event.preventDefault();
        var usuario = Singleton.getInstance();
        usuario.borrar(logout, failGenerico);
    });
}

/**
 * Funcionalidad posterior a la edición de un usuario.
 */
function doneEstadistica(data, status) {
    /*console.log('El usuario que llega de la edicion:')
    console.log(data);*/
    /*$.cookie("usuario", JSON.stringify(data));*/
    /*$("#divCheckPasswordMatch").html("Usuario actualizado.");*/
}