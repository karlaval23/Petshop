<?php 

	//Retorla la url del proyecto
	function base_url()
	{
		return BASE_URL;
	}
    function media()
    {
        return BASE_URL."Assets/";
    }
    //funciones para llamar a los templates admin

    function mediaCliente()
    {
        return BASE_URL."Assets/imgCliente/";
    }
    function headerAdmin($data="")
    {
        $view_header = "Views/Template_admin/HeaderAdmin.php";
        require_once ($view_header);
    }

    function navAdmin($data="")
    {
        $view_nav = "Views/Template_admin/NavAdmin.php";
        require_once ($view_nav);        
    }
    function footerAdmin($data="")
    {
        $view_footer = "Views/Template_admin/FooterAdmin.php";
        require_once ($view_footer);        
    }

    // CLIENTE
    function headerCliente($data="")
    {
        $view_header = "Views/Template_cliente/HeaderCliente.php";
        require_once ($view_header);
    }

    function navCliente($data="")
    {
        $view_nav = "Views/Template_cliente/NavCliente.php";
        require_once ($view_nav);        
    }
function footerCliente($data="")
    {
        $view_footer = "Views/Template_cliente/FooterCliente.php";
        require_once ($view_footer);
    }

    // Carga el contenedor del carrito para las vistas del cliente
    function carritoCliente()
    {
        $view_cart = "Views/Template_cliente/CartWidget.php";
        require_once ($view_cart);
    }
    function getModal(string $nameModal, $data){
        $viewModal="Views/Template_admin/Modals/{$nameModal}.php";
        require_once($viewModal);
    }
	//Muestra información formateada
    function dep($data)
    {
        // Utiliza la función htmlentities() para evitar problemas con caracteres especiales
        $formattedData = htmlentities(print_r($data, true));
        // Retorna el texto preformateado dentro de la etiqueta <pre>
        return "<pre>{$formattedData}</pre>";
    }
    
    //Elimina exceso de espacios entre palabras
    function strClean($strCadena){
        $string = preg_replace(['/\s+/','/^\s|\s$/'],[' ',''], $strCadena);
        $string = trim($string); //Elimina espacios en blanco al inicio y al final
        $string = stripslashes($string); // Elimina las \ invertidas
        $string = str_ireplace("<script>","",$string);
        $string = str_ireplace("</script>","",$string);
        $string = str_ireplace("<script src>","",$string);
        $string = str_ireplace("<script type=>","",$string);
        $string = str_ireplace("SELECT * FROM","",$string);
        $string = str_ireplace("DELETE FROM","",$string);
        $string = str_ireplace("INSERT INTO","",$string);
        $string = str_ireplace("SELECT COUNT(*) FROM","",$string);
        $string = str_ireplace("DROP TABLE","",$string);
        $string = str_ireplace("OR '1'='1","",$string);
        $string = str_ireplace('OR "1"="1"',"",$string);
        $string = str_ireplace('OR ´1´=´1´',"",$string);
        $string = str_ireplace("is NULL; --","",$string);
        $string = str_ireplace("is NULL; --","",$string);
        $string = str_ireplace("LIKE '","",$string);
        $string = str_ireplace('LIKE "',"",$string);
        $string = str_ireplace("LIKE ´","",$string);
        $string = str_ireplace("OR 'a'='a","",$string);
        $string = str_ireplace('OR "a"="a',"",$string);
        $string = str_ireplace("OR ´a´=´a","",$string);
        $string = str_ireplace("OR ´a´=´a","",$string);
        $string = str_ireplace("--","",$string);
        $string = str_ireplace("^","",$string);
        $string = str_ireplace("[","",$string);
        $string = str_ireplace("]","",$string);
        $string = str_ireplace("==","",$string);
        return $string;
    }
    //Genera una contraseña de 10 caracteres
	function passGenerator($length = 10)
    {
        $pass = "";
        $longitudPass=$length;
        $cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        $longitudCadena=strlen($cadena);

        for($i=1; $i<=$longitudPass; $i++)
        {
            $pos = rand(0,$longitudCadena-1);
            $pass .= substr($cadena,$pos,1);
        }
        return $pass;
    }
    //Genera un token
    function token()
    {
        $r1 = bin2hex(random_bytes(10));
        $r2 = bin2hex(random_bytes(10));
        $r3 = bin2hex(random_bytes(10));
        $r4 = bin2hex(random_bytes(10));
        $token = $r1.'-'.$r2.'-'.$r3.'-'.$r4;
        return $token;
    }
    //Formato para valores monetarios
    function formatMoney($cantidad){
        $cantidad = number_format($cantidad,2,SPD,SPM);
        return $cantidad;
    }
 ?>