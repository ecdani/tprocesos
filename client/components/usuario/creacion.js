

function creacionExec() {
    $("#password, #validarpassword").keyup(checkPasswordMatch);

    $('#nombreBtn').on('click', function(event) {
        event.preventDefault();

        var usuario = Singleton.getInstance();
        usuario.nombre = $('#nombre').val();
        usuario.password = $('#password').val();
        usuario.crear(doneAutenticarse,failCrearUsuario);

        $('#control').empty();
    });
}

/*
function crearUsuario(nombre, password, email) {
    if (nombre == "") {
        nombre = "jugador";
    }
    $.post("/crearUsuario", {
        nombre: nombre,
        password: password,
        email: email,
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
}*/