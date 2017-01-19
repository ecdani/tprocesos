

/**
 * Función para ejecutar al cargar la pantalla de edición
 */
function estadisticaExec() {
    if (typeof $.cookie('usuario') === 'undefined') {
        //no cookie
        $('#control3').show();
        $('#control2').hide();
        $('#enlaceCreacion').on('click', mostrarCreacion);
        $('#enlaceAutenticacion').on('click', mostrarAutenticacion);
    } else {
        var usuario = Singleton.getInstance();
        usuario.loadSession(loadSessionEstadisticaDone, failGenerico);
        $('#control3').hide();
        function loadSessionEstadisticaDone(data, status) {
            $('#score1').html(usuario.segundos[0])
            $('#score2').html(usuario.segundos[1])
            $('#score3').html(usuario.segundos[2])
            $('#score4').html(usuario.segundos[3])
            $('#score5').html(usuario.segundos[4])
            $('#scoretotal').html(usuario.score)
        }
    }

    $.get('estadistica.json', function (data) {
        $(function () {
            $('#table').bootstrapTable({
                data: data
            });
        });
    });
}
