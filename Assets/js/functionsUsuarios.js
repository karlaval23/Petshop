var tableUsuarios;

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href === base_url + "usuarios") {
        tableUsuarios = $('#tableUsuarios').dataTable({
            "aProcessing": true,
            "aServerSide": true,
            "language": {
                url: " " + base_url + "Assets/js/es-ES.json",
            },
            "ajax": {
                "url": " " + base_url + "Usuarios/getUsuarios",
                "dataSrc": "",
                "error": function () {
                    alert("Error al cargar los datos ");
                },
            },
            "columns": [
                { "data": "idusuario" },
                { "data": "nombre" },
                { "data": "email" },
                { "data": "telefono" },
                { "data": "rol" },
                { "data": "status" },
                { "data": "acciones" }
            ],
            "responsive": true,
            "bDestroy": true,
            "iDisplayLength": 10,
            "order": [[0, "asc"]]
        });
    };
});

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href === base_url + "usuarios") {
        var formUsuario = document.querySelector("#formUsuario");
        formUsuario.onsubmit = function (e) {
            e.preventDefault();

            var intIdUsuario = document.querySelector('#idUsuario').value;
            var strNombre = document.querySelector('#txtNombre').value;
            var strEmail = document.querySelector('#txtEmail').value;
            var strTelefono = document.querySelector('#txtTelefono').value;
            var strPassword = document.querySelector('#txtPassword').value;
            var intRolId = document.querySelector('#listRol').value;
            var intStatus = document.querySelector('#listStatus').value;

            if (strNombre == '' || strEmail == '' || strTelefono == '' || intRolId == '' || intStatus == '') {
                Swal.fire({
                    title: "Atención",
                    text: "Todos los campos, excepto la contraseña, son obligatorios.",
                    icon: "error"
                });
                return false;
            }

            var formData = new FormData(formUsuario);
            if (strPassword.trim() == '') {
                formData.delete('txtPassword');  // Elimina la contraseña del formulario si está vacía
            }

            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Usuarios/setUsuario';
            request.open("POST", ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    console.log(request.responseText);
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormUsuario').modal("hide");
                        formUsuario.reset();
                        Swal.fire({
                            title: "Usuarios",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableUsuarios.api().ajax.reload();
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
    }
});

function cargarRoles(selectedRolId = null) {
    var selectRol = document.querySelector("#listRol");
    selectRol.innerHTML = ""; // Limpiar opciones actuales

    var request = new XMLHttpRequest();
    request.open("GET", base_url + "Roles/getSelectRoles", true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var roles = JSON.parse(request.responseText); // Asegurarse de que se parsea el JSON
            roles.forEach(function(role) {
                const option = document.createElement("option");
                option.value = role.idrol;
                option.textContent = role.nombrerol;
                selectRol.appendChild(option);
            });

            // Establecer el rol actual si se ha proporcionado
            if (selectedRolId !== null) {
                selectRol.value = selectedRolId;
            }
        }
    };
}



function openModalUsuario() {
    document.querySelector('#idUsuario').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector("#formUsuario").reset();
    document.querySelector("#txtPassword").placeholder = "Ingresar Contraseña";
    cargarRoles();
    $('#modalFormUsuario').modal('show');
}

// function fntEditUsuario(idUsuario) {
//     document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
//     document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
//     document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
//     document.querySelector('#btnText').innerHTML = "Actualizar";
    

//     var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
//     var ajaxUrl = base_url + 'Usuarios/getUsuario/' + idUsuario;
//     request.open("GET", ajaxUrl, true);
//     request.send();
    

//     request.onreadystatechange = function () {
//         if (request.readyState == 4 && request.status == 200) {
//             var objData = JSON.parse(request.responseText);
//             if (objData.status) {
//                 document.querySelector("#idUsuario").value = objData.data.idusuario;
//                 document.querySelector("#txtNombre").value = objData.data.nombre;
//                 document.querySelector("#txtEmail").value = objData.data.email;
//                 document.querySelector("#txtPassword").value = objData.data.password;
//                 document.querySelector("#txtTelefono").value = objData.data.telefono;
                

//                 // Select the role
//                 var selectRol = document.querySelector("#listRol");
//                 cargarRoles(selectRol);
//                 selectRol.value = objData.data.rol_id; // Assuming objData.data.rol_id contains the ID of the role

//                 var optionSelect = '';
//                 if (objData.data.status == 1) {
//                     optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
//                 } else {
//                     optionSelect = '<option value="0" selected class="notBlock">Inactivo</option>';
//                 }
//                 var htmlSelect = `${optionSelect}
//                                   <option value="1">Activo</option>
//                                   <option value="0">Inactivo</option>
//                                 `;
//                 document.querySelector("#listStatus").innerHTML = htmlSelect;
//                 $('#modalFormUsuario').modal('show');


//             } else {
//                 Swal.fire({
//                     title: "Error",
//                     text: objData.msg,
//                     icon: "error"
//                 });
//             }
//         }
//     }
// }

function fntEditUsuario(idUsuario) {
    document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector("#txtPassword").placeholder = "Dejar en blanco para mantener la actual";

    document.querySelector('#btnText').innerHTML = "Actualizar";

    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Usuarios/getUsuario/' + idUsuario;
    request.open("GET", ajaxUrl, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                document.querySelector("#idUsuario").value = objData.data.idusuario;
                document.querySelector("#txtNombre").value = objData.data.nombre;
                document.querySelector("#txtEmail").value = objData.data.email;
                document.querySelector("#txtPassword").value = "";  // No cargar la contraseña actual
                document.querySelector("#txtTelefono").value = objData.data.telefono;

                cargarRoles(objData.data.rolid);
                
                var optionSelect = '';
                if (objData.data.status == 1) {
                    optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
                } else {
                    optionSelect = '<option value="0" selected class="notBlock">Inactivo</option>';
                }
                var htmlSelect = `${optionSelect}
                                  <option value="1">Activo</option>
                                  <option value="0">Inactivo</option>`;
                document.querySelector("#listStatus").innerHTML = htmlSelect;
                $('#modalFormUsuario').modal('show');
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

function fntDelUsuario(idUsuario) {
    Swal.fire({
        title: "Eliminar Usuario",
        text: "¿Realmente quiere eliminar el Usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "No, cancelar!",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Usuarios/delUsuario/';
            var strData = "idUsuario=" + idUsuario;
            request.open("POST", ajaxUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        Swal.fire({
                            title: "Eliminado!",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableUsuarios.api().ajax.reload();
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

