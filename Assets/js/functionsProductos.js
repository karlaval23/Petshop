var tableProductos;

document.addEventListener('DOMContentLoaded', function () {

    tableProductos = $('#tableProductos').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            url: base_url + "Assets/js/es-ES.json",
        },
        "ajax": {
            "url": base_url + "Productos/getProductos",
            "dataSrc": "",
            "error": function () {
                alert("Error al cargar los datos");
            }
        },
        "columns": [
            { "data": "idproducto" },
            { "data": "nombre_categoria" }, // Cambia el nombre de la columna a la categoría del producto
            { "data": "nombre" },
            { "data": "descripcion" },
            { "data": "precio" },
            { "data": "stock" },
            { "data": "imagen" },
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
    if (window.location.href === base_url + "productos") {

        // NUEVO PRODUCTO
        var formProducto = document.querySelector("#formProducto");
        formProducto.onsubmit = function (e) {
            e.preventDefault();

            var intIdProducto = document.querySelector('#idProducto').value;
            var intIdProveedor = document.querySelector('#listProveedor').value;
            var intIdCategoria = document.querySelector('#listCategoria').value; // Nuevo campo agregado
            var strNombre = document.querySelector('#txtNombre').value;
            var strDescripcion = document.querySelector('#txtDescripcion').value;
            var fltPrecio = document.querySelector('#txtPrecio').value;
            var intStock = document.querySelector('#txtStock').value;
            var strImagen = document.querySelector('#txtImagen').value;
            var intStatus = document.querySelector('#listStatus').value;
            if (strNombre == '' || strDescripcion == '' || fltPrecio == '' || intStock == '' || strImagen == '' || intStatus == '') {
                Swal.fire({
                    title: "Atención",
                    text: "Todos los campos son obligatorios.",
                    icon: "error"
                });
                return false;
            }

            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Productos/setProducto';
            var formData = new FormData(formProducto);
            request.open("POST", ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    console.log(request.responseText)
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormProducto').modal("hide");
                        formProducto.reset();
                        Swal.fire({
                            title: "Productos",
                            text: objData.msg,
                            icon: "success"
                        });
                        tableProductos.api().ajax.reload();
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

function openModalProducto() {
    document.querySelector('#idProducto').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Producto";
    document.querySelector("#formProducto").reset();
    cargarProveedores();
    cargarCategorias();
    $('#modalFormProducto').modal('show');
}

function fntEditProducto(idproducto) {
    document.querySelector('#titleModal').innerHTML = "Actualizar Producto";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";

    var idproducto = idproducto;
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + 'Productos/getProducto/' + idproducto;
    request.open("GET", ajaxUrl, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                document.querySelector("#idProducto").value = objData.data.idproducto;
                // document.querySelector("#idProveedor").value = objData.data.idproveedor;
                // document.querySelector("#idCategoria").value = objData.data.idcategoria; // Nuevo campo agregado
                document.querySelector("#txtNombre").value = objData.data.nombre;
                document.querySelector("#txtDescripcion").value = objData.data.descripcion;
                document.querySelector("#txtPrecio").value = objData.data.precio;
                document.querySelector("#txtStock").value = objData.data.stock;
                document.querySelector("#txtImagen").value = objData.data.imagen;

                cargarProveedores(objData.data.idproveedor);
                cargarCategorias(objData.data.idcategoria);

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
                $('#modalFormProducto').modal('show');
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

function cargarProveedores(selectedProveedorId = null) {
    var selectProveedor = document.querySelector("#listProveedor");
    selectProveedor.innerHTML = ""; // Limpiar opciones actuales

    var request = new XMLHttpRequest();
    request.open("GET", base_url + "Proveedores/getSelectProveedores", true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var proveedores = JSON.parse(request.responseText); // Asegurarse de que se parsea el JSON
            proveedores.forEach(function(proveedor) {
                const option = document.createElement("option");
                option.value = proveedor.idproveedor;
                option.textContent = proveedor.nombre;
                selectProveedor.appendChild(option);
            });

            // Establecer el proveedor actual si se ha proporcionado
            if (selectedProveedorId !== null) {
                selectProveedor.value = selectedProveedorId;
            }
        }
    };
}


function cargarCategorias(selectedCategoriaId = null) {
    var selectCategoria = document.querySelector("#listCategoria");
    selectCategoria.innerHTML = ""; // Limpiar opciones actuales

    var request = new XMLHttpRequest();
    request.open("GET", base_url + "Categorias/getSelectCategorias", true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var categorias = JSON.parse(request.responseText); // Asegurarse de que se parsea el JSON

            categorias.forEach(function(categoria) {
                const option = document.createElement("option");
                option.value = categoria.idcategoria;
                option.textContent = categoria.nombre;
                selectCategoria.appendChild(option);
            });

            // Establecer la categoría actual si se ha proporcionado
            if (selectedCategoriaId !== null) {
                selectCategoria.value = selectedCategoriaId;
            }
        }
    };
}

function fntDelProducto(idproducto) {
    var idproducto = idproducto;
    Swal.fire({
        title: "Eliminar Producto",
        text: "¿Realmente quiere eliminar el Producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancelar!",
        allowOutsideClick: false
    }).then((isConfirm) => {
        if (isConfirm.isConfirmed) {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var ajaxUrl = base_url + 'Productos/delProducto/';
            var strData = "idproducto=" + idproducto;
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
                        tableProductos.api().ajax.reload();
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
