

/**
 * Función para ejecutar al cargar la pantalla de edición
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

        var usuario = Singleton.getInstance();
        usuario.loadSession(loadSessionEstadisticaDone, failGenerico);

        console.log("hay cookie");
        $('#control3').hide();
        //$('#control2').show();
        //var usuario = $.cookie("usuario");
        //usuario = $.parseJSON(usuario);
        function loadSessionEstadisticaDone(data, status) {
            console.log("Colocando puntuaciones personales del player")
            console.log(usuario)
            $('#score1').html(usuario.segundos[0])
            $('#score2').html(usuario.segundos[1])
            $('#score3').html(usuario.segundos[2])
            $('#score4').html(usuario.segundos[3])
            $('#score5').html(usuario.segundos[4])
            $('#scoretotal').html(usuario.score)
        }

    }

    console.log("EJECUTANDO ESTADISTICA");

    $.get('estadistica.json', function (data) {

        console.log("EJECUTANDO ESTADISTICA2");
        $(function () {
            console.log("EJECUTANDO ESTADISTICA3");
            console.log(data);
            $('#table').bootstrapTable({
                data: data
            });
        });
    });
}
