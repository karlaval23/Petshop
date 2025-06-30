var tableRoles;

document.addEventListener('DOMContentLoaded', function () {

    tableRoles = $('#tableRoles').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            url: " " + base_url + "Assets/js/es-ES.json",
        },
        "ajax": {
            "url": " " + base_url + "Roles/getRoles",
            "dataSrc": "",
            "error": function () {
                alert("Error al cargar los datos ");
            }
        },
        "columns": [
            { "data": "idrol" },
            { "data": "nombrerol" },
            { "data": "descripcion" },
            { "data": "status" },
            { "data": "acciones" }
        ],
        "responsive": true,
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]]
    });

    // document.addEventListener('submit', function (e) {
    //     if (e.target && e.target.id === 'formPermisos') {
    //         e.preventDefault(); // Prevenir el envío del formulario por defecto
    //         fntSavePermisos(e); // Llamar a la función para guardar los permisos
    //     }
    // });

    //extra:

});

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href === base_url + "roles") {

        //NUEVO ROL
        var formRol = document.querySelector("#formRol");
        formRol.onsubmit = function (e) {
            e.preventDefault();

            var intIdRol = document.querySelector('#idRol').value;
            var strNombre = document.querySelector('#txtNombre').value;
            var strDescripcion = document.querySelector('#txtDescripcion').value;
            var intStatus = document.querySelector('#listStatus').value;
            if (strNombre == '' || strDescripcion == '' || intStatus == '') {
                Swal.fire({
                    title: "Atención",
                    text: "Todos los campos son obligatorios.",
                    icon: "error"
                });
                return false;
            }

            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Roles/setRol';
            var formData = new FormData(formRol);
            request.open("POST", ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    // console.log(request.responseText);//comprobacion
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormRol').modal("hide");
                        formRol.reset();
                        Swal.fire({
                            title: "Roles de usuario",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableRoles.api().ajax.reload();
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: objData.msg,
                            icon: "error"
                        });
                    }
                }
                return false;
            }
        }
    }
});

function openModal() {
    document.querySelector('#idRol').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Rol";
    document.querySelector("#formRol").reset();
    $('#modalFormRol').modal('show');
}

// window.addEventListener('load', function() {
//     fntEditRol();
//     fntDelRol();
//     fntPermisos();
// }, false);

function fntEditRol(idrol) {
    document.querySelector('#titleModal').innerHTML = "Actualizar Rol";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";

    var idrol = idrol;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Roles/getRol/' + idrol;
    request.open("GET", ajaxUrl, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                document.querySelector("#idRol").value = objData.data.idrol;
                document.querySelector("#txtNombre").value = objData.data.nombrerol;
                document.querySelector("#txtDescripcion").value = objData.data.descripcion;

                var optionSelect = '';
                if (objData.data.status == 1) {
                    optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
                } else {
                    optionSelect = '<option value="0" selected class="notBlock">Inactivo</option>';
                }
                var htmlSelect = `${optionSelect}
                                  <option value="1">Activo</option>
                                  <option value="0">Inactivo</option>
                                `;
                document.querySelector("#listStatus").innerHTML = htmlSelect;
                $('#modalFormRol').modal('show');
            } else {
                Swal.fire({
                    title: "Error",
                    text: objData.msg,
                    icon: "error"
                });
            }
        }
    }
}

function fntDelRol(idrol) {
    var idrol = idrol;
    Swal.fire({
        title: "Eliminar Rol",
        text: "¿Realmente quiere eliminar el Rol?",
        icon: "warning", // Usar "warning" en lugar de "type"
        showCancelButton: true,
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancelar!",
        allowOutsideClick: false
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Roles/delRol/';
            var strData = "idrol=" + idrol;
            request.open("POST", ajaxUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        Swal.fire({
                            title: "Eliminar!",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableRoles.api().ajax.reload(
                            //     function() {
                            //     fntEditRol();
                            //     fntDelRol();
                            //     fntPermisos();
                            // }
                        );
                    } else {
                        Swal.fire({
                            title: "Atención!",
                            text: objData.msg,
                            icon: "error"
                        });
                    }
                }
            }
        }
    });
}

// function fntPermisos(idrol) {
//     var idrol = idrol;
//     var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
//     var ajaxUrl = base_url + 'Permisos/getPermisosRol/' + idrol;
//     request.open("GET", ajaxUrl, true);
//     request.send();
//     console.log("se ejecuta")

//     request.onreadystatechange = function() {
//         if(request.readyState == 4 && request.status == 200) {
//             // document.querySelector('#contentAjax').innerHTML = request.responseText;
//             console.log("se antes")
//             $('#modalPermisos').modal('show');
//             console.log("se Despues")
//             // document.querySelector('#formPermisos').addEventListener('submit', fntSavePermisos, true);
//         }
//     }
// }

// function fntPermisos(idrol) {
//     var idrol = idrol;
//     var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
//     var ajaxUrl = base_url + 'Permisos/getPermisosRol/' + idrol;
//     request.open("GET", ajaxUrl, true);
//     request.send();

//     request.onreadystatechange = function () {
//         if (request.readyState == 4 && request.status == 200) {
//             $('#modalFormPermisos').modal('show');
//             console.log("se Despues")
//         }
//     }
// }

function fntPermisos(idrol) {
    var idrol = idrol;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Permisos/getPermisosRol/' + idrol;
    request.open("GET", ajaxUrl, true);
    request.send();

    request.onreadystatechange = function () {
        try {
            if (request.readyState == 4 && request.status == 200) {
                document.querySelector('#contentAjax').innerHTML = request.responseText;
                $('#modalFormPermisos').modal('show');

                try {
                    document.querySelector('#modalFormPermisos').addEventListener('btnGuardar', fntSavePermisos, false);
                    console.log("Se escuchó correctamente");
                } catch (error) {
                    console.error("Ocurrió un error al agregar el event listener:", error);
                }
            }
        } catch (error) {
            console.error("Ocurrió un error al ejecutar el bloque de código:", error);
        }
    }

}

function fntSavePermisos() {
    console.log("Ingreso de funcion")
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Permisos/setPermisos';
    var formElement = document.querySelector("#formPermisos");
    var formData = new FormData(formElement);
    console.log(formData)
    request.open("POST", ajaxUrl, true);
    request.send(formData);
    console.log("Datos enviados")
    request.onreadystatechange = function () {
        // console.log(request.responseText)
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                Swal.fire({
                    title: "Permisos de usuario",
                    text: objData.msg,
                    icon: "success"
                });
                $('#modalFormPermisos').modal('hide')
            } else {
                Swal.fire({
                    title: "Error",
                    text: objData.msg,
                    icon: "error"
                });
            }
        }
    }

}



