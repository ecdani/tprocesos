

function creacionExec() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function(event) {
        event.preventDefault();
        nombre = $('#nombre').val();
        password = $('#password').val();
        //console.dir(nombre);
        crearUsuario(nombre, password);
        $('#control').empty();

    });
}


function crearUsuario(nombre, password) {
    if (nombre == "") {
        nombre = "jugador";
    }
    $.post("/crearUsuario", {
        nombre: nombre,
        password: password
    },
        function(data, status) {
            callbackAutenticarse(data, status);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            switch (jqXHR.status) {
                case 409:
                    console.log(jqXHR);
                    $("#divCheckPasswordMatch").html("El nombre de usuario ya existe.");
                    break;
                case 500:
                    console.log(jqXHR);
                    $("#divCheckPasswordMatch").html("Error en el servidor.");
                    break;
                default:
            }
        });
}