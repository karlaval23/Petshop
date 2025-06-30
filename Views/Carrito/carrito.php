<?=headerCliente();?>
<?=navCliente();?>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="estilo.css">
<script src="app.js" async></script>

<header>
    <h1>Carrito de compras</h1>
</header>
<section class="contenedor">
    <div class="contenedor-items">
        <!-- Los productos del carrito se cargan desde localStorage -->
    </div>
    <div class="carrito">
        <div class="header-carrito">
            <h2>Tu Carrito</h2>
        </div>
        <div class="carrito-items"></div>
        <div class="carrito-total">
            <div class="fila">
                <strong>Total</strong>
                <span class="carrito-precio-total">$0</span>
            </div>
            <button class="btn-pagar">Pagar <i class="fa-solid fa-bag-shopping"></i></button>
        </div>
    </div>
</section>

<?=footerCliente();?>