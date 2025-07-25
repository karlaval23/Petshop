<?php
class Roles extends Controllers
{
	public function __construct()
	{
		parent::__construct();
	}

	public function roles()
	{
		$data['page_id'] = 3;
		$data['page_tag'] = "Roles usuario";
		$data['page_title'] = "Roles de usuario <small> Tienda </small>";
		$data['page_name'] = "rol_usuario";
		$this->views->getView($this, "roles", $data);
	}
	public function getRoles()
	{
		$arrData = $this->model->selectRoles();
		for ($i = 0; $i < count($arrData); $i++) {

			if ($arrData[$i]['status'] == 1) {
				$arrData[$i]['status'] = '<span class="me-1 badge bg-success">Activo</span>';
			} elseif ($arrData[$i]['status'] == 0) {
				$arrData[$i]['status'] = '<span class="me-1 badge bg-danger">Inactivo</span>';
			}
			$arrData[$i]['acciones'] = '<div class="text-center">
				<button type="button" name="btnPermisosRol" class="btn btn-secondary btnPermisosRol" onClick="fntPermisos(' . $arrData[$i]['idrol'] . ')" title="Permisos"><i class="bi bi-key"></i></button>
				<button type="button" name="btnEditRol" class="btn btn-primary btnEditRol" onClick="fntEditRol(' . $arrData[$i]['idrol'] . ')" title="Editar"><i class="bi bi-pencil"></i></button>
				<button type="button" name="btnDelRol" class="btn btn-danger btnDelRol" onClick="fntDelRol(' . $arrData[$i]['idrol'] . ')" title="Eliminar"><i class="bi bi-trash"></i></button>
				</div>';
		}
		echo json_encode($arrData, JSON_UNESCAPED_UNICODE);
		die();
	}

	public function getSelectRoles()
{
    $arrData = $this->model->selectRoles();
    $roles = []; // Array para almacenar los roles que se enviarán
    if (count($arrData) > 0) {
        foreach ($arrData as $role) {
            if ($role['status'] == 1) { // Solo incluir roles activos
                $roles[] = [
                    'idrol' => $role['idrol'],
                    'nombrerol' => $role['nombrerol']
                ];
            }
        }
    }
    echo json_encode($roles); // Devolver los roles en formato JSON
    die();
}

	public function getRol(int $idrol)
	{

		$intIdrol = intval(strClean($idrol));
		if ($intIdrol > 0) {
			$arrData = $this->model->selectRol($intIdrol);
			if (empty($arrData)) {
				$arrResponse = array('status' => false, 'msg' => 'Datos no encontrados.');
			} else {
				$arrResponse = array('status' => true, 'data' => $arrData);
			}
			echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
		}
	}
	public function setRol()
	{
		$intIdrol = intval($_POST['idRol']);
		$strRol = strClean($_POST['txtNombre']);
		$strDescipcion = strClean($_POST['txtDescripcion']);
		$intStatus = intval($_POST['listStatus']);
		$request_rol = "";
		$option = 0; // Variable para determinar si es una creación (1) o una actualización (2)

		if ($intIdrol == 0) {
			// Crear
			$request_rol = $this->model->insertRol($strRol, $strDescipcion, $intStatus);
			$option = 1;
		} else {
			// Actualizar
			$request_rol = $this->model->updateRol($intIdrol, $strRol, $strDescipcion, $intStatus);
			$option = 2;
		}

		if ($request_rol > 0) {
			if ($option == 1) {
				$arrResponse = array('status' => true, 'msg' => 'Datos guardados correctamente.');
			} else {
				$arrResponse = array('status' => true, 'msg' => 'Datos actualizados correctamente.');
			}
		} elseif ($request_rol == 'exist') {
			$arrResponse = array('status' => false, 'msg' => '¡Atención! El Rol ya existe.');
		} else {
			$arrResponse = array("status" => false, "msg" => 'No es posible almacenar los datos.');
		}

		echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
		die(); // Asegura que no se envíe ninguna salida adicional
	}


	public function delRol()
	{
		if ($_POST) {
			$intIdrol = intval($_POST['idrol']);
			$requestDelete = $this->model->deleteRol($intIdrol);
			if ($requestDelete == 'ok') {
				$arrResponse = array('status' => true, 'msg' => 'Se ha eliminado el Rol');
			} else if ($requestDelete == 'exist') {
				$arrResponse = array('status' => false, 'msg' => 'No es posible eliminar un Rol asociado a usuarios.');
			} else {
				$arrResponse = array('status' => false, 'msg' => 'Error al eliminar el Rol.');
			}
			echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
		}
		die();
	}

}
?>