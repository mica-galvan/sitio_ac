//OBJETOS PRODUCTOS Y CARRITO

//Esta clase representa al producto 
class producto {
    constructor(idProducto, modelo, tipo, talle, color, precio) {
        this.idProducto = idProducto;
        this.modelo = modelo;
        this.tipo = tipo;
        this.talle = talle;
        this.color = color;
        this.precio = precio;
        this.info = `${this.modelo}, de ${this.tipo}, talle ${this.talle}, color ${this.color}, precio $${this.precio}`;
        this.infoCarrito = `${this.modelo}, de ${this.tipo}, talle ${this.talle}, color ${this.color}`;
    }
};

//Esta clase representa a un elemento dentro del carrito (contiene un objeto producto)
class productoCarrito {
    constructor(unProducto, unID) {
        this.unProducto = unProducto;
        this.unID = unID;
        this.unaCantidad = 1;
    }
};

//Esta clase representa al carrito de compras (contiene un array de productoCarrito)
class carritoDeCompra {
    constructor() {
        this.productos = [];
        this.total = 0;
        this.maxId = 0;
    }

    agregar(producto) {
        let existe = this.productos.find(e => e.unProducto.idProducto == producto.idProducto);
        
        (typeof existe !== 'undefined') ? existe.unaCantidad++ : this.productos.push(new productoCarrito(producto, this.obtenerNextID()));

        Swal.fire({
            toast: true,
            position: 'top-right',
            iconColor: 'pink',
            customClass: {
                popup: 'colored-toast'
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            icon: 'success',
            title: '&#127881 Agregando al carrito...',
            color: '',
            background: '#FFEEF8'
        });
        
        localStorage.setItem("carrito", JSON.stringify(carritoObjeto.productos)); //localStorage
        localStorage.setItem("maxid", carritoObjeto.maxId);
    }

    quitar(idProdCart) {
        let item = this.productos.find(element => element.unID == idProdCart);
        const index = this.productos.indexOf(item);
        
        index > -1 && this.productos.splice(index, 1);
        
        Swal.fire({
            toast: true,
            position: 'top-right',
            iconColor: 'pink',
            customClass: {
                popup: 'colored-toast'
            },
            showConfirmButton: false,
            timer: 900,
            timerProgressBar: true,
            icon: 'error',
            title: ' &#8987  Quitando del carrito...',
            color: '',
            background: '#FFEEF8'
        });

        localStorage.setItem("carrito", JSON.stringify(carritoObjeto.productos))
        limpiarCalculoCuotas();
        mostrarTabla();
    }

    calcularTotal() {
        return this.productos.reduce((acumulador, producto) => acumulador + (producto.unProducto.precio * producto.unaCantidad), 0);
    }

    vaciarElCarrito() {
        this.productos = [];
        this.maxId = 0;

        Swal.fire({
            title: '¡Listo!',
            text: 'Su carrito ya está vacío',
            showConfirmButton: false,
            background: '#FFEEF8',
            timer: 1000

        })
        localStorage.setItem("carrito", JSON.stringify(carritoObjeto.productos));
        localStorage.setItem("maxid", carritoObjeto.maxId);

        limpiarCalculoCuotas();
    }

    obtenerNextID() {
        //this.maxId += 1;
        this.maxId++;  //optimizado
        return this.maxId;
    }
};

let carritoObjeto = new carritoDeCompra();

// levanta el localStorage
if (localStorage.getItem("carrito")) {
    carritoObjeto.productos = JSON.parse(localStorage.getItem("carrito"));
    carritoObjeto.maxId = parseInt(localStorage.getItem("maxid"));

    setTimeout(mostrarTabla(), 500); //timer para asegurar que la página cargue el localStorage
};

// setea eventos sobre el boton de vaciar carrito
let botonVaciar = document.getElementById("vaciarCarrito");
botonVaciar.onclick = () => carritoObjeto.vaciarElCarrito();
botonVaciar.addEventListener("click", mostrarTabla);

// setea eventos sobre el boton de checkout/finalizar compra
let botonCheckout = document.getElementById("finalizarCompra");
botonCheckout.addEventListener("click", function() { document.getElementById("irFinalizarCompra").click() });


//Carrito
function mostrarTabla() {
    // deshabilita el boton de checkout
    document.getElementById("finalizarCompra").setAttribute("disabled", "disabled")

    let tabla = document.getElementById("contenidoCarrito");
    document.getElementById("contadorCart").innerText = carritoObjeto.productos.length;
    
    tabla.innerHTML = "";
    if (carritoObjeto.productos.length > 0) {
        // si el carrito tiene elementos habilita el botón de checkout
        document.getElementById("finalizarCompra").removeAttribute("disabled");
        
        document.getElementById("textoCarritoVacio").innerText = "Su carrito contiene " + carritoObjeto.productos.length + " productos"; //contador carrito -->texto que avisa si tiene productos
        //  este producto es un productoCarrito
        for (const productoCart of carritoObjeto.productos) {
            let row = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");

            //crea los elementos
            td1.innerText = productoCart.unProducto.infoCarrito;
            td2.innerText = productoCart.unaCantidad.toString();
            td3.innerText = productoCart.unProducto.precio.toString();

            //botón de quitar producto
            let btn = document.createElement("button");
            btn.innerText = "X";
            btn.className = "btn btn-secondary";
            btn.dataset.id = productoCart.unID;
            btn.id = "eliminarProducto";
            btn.onclick = () => carritoObjeto.quitar(productoCart.unID);
            btn.addEventListener("click", mostrarTabla);

            td4.appendChild(btn);

            // agrega elemento al padre
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);

            tabla.appendChild(row);
        }

        let row = document.createElement("tr");
        let th = document.createElement("td");
        let td = document.createElement("td");

        row.setAttribute("class", "table-danger");

        th.innerText = "Total";
        th.setAttribute("scope", "row");
        td.innerText = carritoObjeto.calcularTotal();
        td.setAttribute("colspan", "3");

        row.appendChild(th);
        row.appendChild(td);

        tabla.appendChild(row);
    } else {
        document.getElementById("textoCarritoVacio").innerText = "Su carrito se encuentra vacío"; //contador carrito
    }
};
