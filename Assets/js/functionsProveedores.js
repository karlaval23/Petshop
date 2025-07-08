var tableProveedores;

document.addEventListener('DOMContentLoaded', function () {

    tableProveedores = $('#tableProveedores').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            url: " " + base_url + "Assets/js/es-ES.json",
        },
        "ajax": {
            "url": " " + base_url + "Proveedores/getProveedores",
            "dataSrc": "",
            "error": function () {
                alert("Error al cargar los datos ");
            }
        },
        "columns": [
            { "data": "idproveedor" },
            { "data": "nombre" },
            { "data": "descripcion" },
            { "data": "telefono" },
            { "data": "email" },
            { "data": "direccion" },
            { "data": "status" },
            { "data": "acciones" }
        ],
        "responsive": true,
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]]
    });

});

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href === base_url + "proveedores") {

        //NUEVO PROVEEDOR
        var formProveedor = document.querySelector("#formProveedor");
        formProveedor.onsubmit = function (e) {
            e.preventDefault();

            var intIdProveedor = document.querySelector('#idProveedor').value;
            var strNombre = document.querySelector('#txtNombre').value;
            var strDescripcion = document.querySelector('#txtDescripcion').value;
            var strTelefono = document.querySelector('#txtTelefono').value;
            var strEmail = document.querySelector('#txtEmail').value;
            var strDireccion = document.querySelector('#txtDireccion').value;
            var intStatus = document.querySelector('#listStatus').value;
            if (strNombre == '' || strDescripcion == '' || strTelefono == '' || strEmail == '' || strDireccion == '' || intStatus == '') {
                Swal.fire({
                    title: "Atención",
                    text: "Todos los campos son obligatorios.",
                    icon: "error"
                });
                return false;
            }

            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Proveedores/setProveedor';
            var formData = new FormData(formProveedor);
            request.open("POST", ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    console.log(request.responseText)
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormProveedor').modal("hide");
                        formProveedor.reset();
                        Swal.fire({
                            title: "Proveedores",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableProveedores.api().ajax.reload();
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

function openModalProveedor() {
    document.querySelector('#idProveedor').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Proveedor";
    document.querySelector("#formProveedor").reset();
    $('#modalFormProveedor').modal('show');
}

function fntEditProveedor(idProveedor) {
    document.querySelector('#titleModal').innerHTML = "Actualizar Proveedor";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";

    var idProveedor = idProveedor;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Proveedores/getProveedor/' + idProveedor;
    request.open("GET", ajaxUrl, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                document.querySelector("#idProveedor").value = objData.data.idproveedor;
                document.querySelector("#txtNombre").value = objData.data.nombre;
                document.querySelector("#txtDescripcion").value = objData.data.descripcion;
                document.querySelector("#txtTelefono").value = objData.data.telefono;
                document.querySelector("#txtEmail").value = objData.data.email;
                document.querySelector("#txtDireccion").value = objData.data.direccion;

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
                $('#modalFormProveedor').modal('show');
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

function fntDelProveedor(idProveedor) {
    var idProveedor = idProveedor;
    Swal.fire({
        title: "Eliminar Proveedor",
        text: "¿Realmente quiere eliminar el Proveedor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancelar!",
        allowOutsideClick: false
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Proveedores/delProveedor/';
            var strData = "idproveedor=" + idProveedor;
            request.open("POST", ajaxUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    // console.log(request.responseText) Comprobacion
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        Swal.fire({
                            title: "Eliminar!",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableProveedores.api().ajax.reload();
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
