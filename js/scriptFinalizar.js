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
        //limpiarCalculoCuotas();
        //mostrarTabla();
    }

    calcularTotal() {
        return this.productos.reduce((acumulador, producto) => acumulador + (producto.unProducto.precio * producto.unaCantidad), 0);
    }

    vaciarElCarrito() {
        this.productos = [];
        this.maxId = 0;
        localStorage.setItem("carrito", JSON.stringify(carritoObjeto.productos));
        localStorage.setItem("maxid", carritoObjeto.maxId);
    }

    obtenerNextID() {
        this.maxId++;
        return this.maxId;
    }
};

let carritoObjeto = new carritoDeCompra();

// levanta el localStorage
if (localStorage.getItem("carrito")) {
    carritoObjeto.productos = JSON.parse(localStorage.getItem("carrito"));
    carritoObjeto.maxId = parseInt(localStorage.getItem("maxid"));
};

// setea eventos sobre los radio button de forma de pago
// efectivo -> oculta tarjetas y cuotas
let radioFormaPago1 = document.getElementById("flexRadioDefault1");
for (radio in radioFormaPago1) {
    radioFormaPago1.onclick = () => ocultarTarjetas();
}

// setea eventos sobre los radio button de forma de pago
// tarjeta -> muestra tarjetas y cuotas
let radioFormaPago2 = document.getElementById("flexRadioDefault2");
for (radio in radioFormaPago2) {
    radioFormaPago2.onclick = () => mostrarTarjetas();
}

// funcion que oculta la seccion de tarjetas y cuotas
function ocultarTarjetas() {
    document.getElementById("myBtn").ariaDisabled = false;
    document.getElementById("myBtn").removeAttribute("disabled");
    limpiarCalculoCuotas();

    var total = 0;
    total = carritoObjeto.calcularTotal();

    // oculta la seccion de tarjetas
    let tj = document.getElementById("tarjetas");
    tj.hidden = true;

    // carga el total de la compra en efectivo
    let elemTotal = document.getElementById("pTotal");
    elemTotal.innerText = "Total: $" + total.toFixed(2);

    // vacía el label de las cuotas y el interes
    let elemCuotas = document.getElementById("pCuotas");
    elemCuotas.innerText = null
};

// funcion que muestra la seccion de tarjetas y cuotas
function mostrarTarjetas() {
    document.getElementById("myBtn").ariaDisabled = false;
    document.getElementById("myBtn").removeAttribute("disabled");
    limpiarCalculoCuotas();

    // vacía el label del total, que se cargará luego al seleccionar las tarjetas y la cantidad de cuotas
    let elemTotal = document.getElementById("pTotal");
    elemTotal.innerText = null;

    // vacía el label de las cuotas, que se cargará luego al seleccionar las tarjetas y la cantidad de cuotas
    let elemCuotas = document.getElementById("pCuotas");
    elemCuotas.innerText = null

    // muestra la seccion de tarjetas
    let tj = document.getElementById("tarjetas");
    tj.hidden = false;
};


// representa el objeto tarjeta
class tarjeta {
    constructor(miId, miTarjeta, misIntereses) {
        this.pId = miId;
        this.pTarjeta = miTarjeta;
        this.pIntereses = [];
        this.setInteres(misIntereses);
    }

    setInteres(inte) {
        for (let queInt of inte) {
            this.pIntereses.push(new interes(Object.keys(queInt)[0], queInt[Object.keys(queInt)]));
        };
    };
};

// representa el objeto cuota/intereses
class interes {
    constructor(miCuota, miInteres) {
        this.pCuota = miCuota;
        this.pInteres = miInteres;
    }
};

// ARRAY de tarjetas
let tarjetas = [];

// función para cargar intereses en el select correspondiente de acuerdo a la tarjeta seleccionada
function cargarInteres(procesadora) {
    if (procesadora == 0) {
        limpiarCalculoCuotas();
    }
    else {
        // busca el objeto tarjeta que corresponde a la tarjeta seleccionada en el select
        let queTarjeta = tarjetas.find(element => element.pId == procesadora);

        // genera el select para las cuotas/intereses
        let _selectCuotas = document.createElement("select");
        _selectCuotas.id = "miSelCuotas";
        _selectCuotas.name = "selCuotas";
        _selectCuotas.classList.add("selCuotas");
        _selectCuotas.options[_selectCuotas.options.length] = new Option("Seleccione cantidad de cuotas", "0");

        queTarjeta.pIntereses.forEach(datoInteres => {
            var texto = datoInteres["pCuota"] + " cuota/s - " + datoInteres["pInteres"] + "% interés";
            _selectCuotas.options[_selectCuotas.options.length] = new Option(texto, datoInteres["pCuota"]);
        });

        // eventListener sobre el evento change del select de cuotas
        _selectCuotas.addEventListener("change", (event) => {
            calcularCuotas();
        });


        // append del select de cuotas al div correspondiente
        let sC = document.getElementById("selectCuotas");
        sC.innerHTML = "";
        sC.append(_selectCuotas);
    }
}

//FETCH del archivo JSON que contiene las tarjetas y sus intereses
fetch('../js/Tarjetas.json')
    .then(resp => resp.json())
    .then(data => {
        data.forEach(datoTarjeta => {
            tarjetas.push(new tarjeta(datoTarjeta["Id"], datoTarjeta["Tarjeta"], datoTarjeta["Interes"]))
        })

        // genera el select para las tarjetas
        let _select = document.createElement("select");
        _select.id = "selTarjetas";
        _select.name = "selTarjetas";
        _select.classList.add("selTarjetas");
        _select.options[_select.options.length] = new Option("Seleccione una tarjeta", "0");
        tarjetas.forEach(datoTarjeta => {
            _select.options[_select.options.length] = new Option(datoTarjeta["pTarjeta"], datoTarjeta["pId"]);
        });

        // eventListener sobre el evento change del select de tarjetas
        _select.addEventListener("change", (event) => {
            cargarInteres(event.target.value.toString());
        });

        // append del select de tarjetas al div correspondiente
        let sT = document.getElementById("selectTarjetas");
        sT.append(_select);

    })
    .catch(function (err) {
        console.log(err.toString());
    })

// función que calcula total con interés y valor de cada cuota de acuerdo a los valores seleccionados para tarjeta y cuotas
function calcularCuotas() {
    var total = 0;
    total = carritoObjeto.calcularTotal();

    // obtiene el value correspondiente a la tarjeta
    var tj = document.getElementsByName("selTarjetas");
    var tjt = tj[0].value;

    // obtiene el value correspondiente a las cuotas
    var ct = document.getElementsByName("selCuotas");
    var cts = ct[0].value;

    // busca la tarjeta correspondiente para obtener las cuotas e intereses de la misma
    let miTjt; // = tarjetas.find(element => element.pId == tjt);
    if (tjt != '0') {
        miTjt = tarjetas.find(element => element.pId == tjt);
    };

    let miInt;
    let porcentaje;
    let totalFinal;
    let valorCuota;

    // calcula valores si: el select de tarjetas es distinto a 0 y el select de cuotas es distinto a 0
    if (tjt != '0' && cts != '0') {
        // obtiene el interes que corresponde a la cuota seleccionada
        miInt = miTjt.pIntereses.find(element => element.pCuota == cts);
        // calcula el porcentaje de interés
        porcentaje = parseFloat(miInt.pInteres) / 100;

        // calcula el total con interés
        totalFinal = total * (1 + porcentaje);
        // calcula el valor de cada cuota
        valorCuota = totalFinal / miInt.pCuota;

        // salida a la página de los valores calculados
        let elemTotal = document.getElementById("pTotal");
        elemTotal.innerText = "$" + total.toFixed(2) + " (sin interés) || $" + totalFinal.toFixed(2) + " (con interés) || " + miInt.pInteres + "% de interés"

        let elemCuotas = document.getElementById("pCuotas");
        elemCuotas.innerText = miInt.pCuota + " cuotas de $" + valorCuota.toFixed(2);
    }
}

// función para limpiar los valores calculados (visual)
function limpiarCalculoCuotas() {
    let elemTotal = document.getElementById("pTotal");
    let elemCuotas = document.getElementById("pCuotas");
    let divSelCuotas = document.getElementById("selectCuotas");

    let setTarjetas = document.getElementById("selTarjetas");
    setTarjetas.value = '0';

    elemTotal.innerText = null;
    elemCuotas.innerText = null;
    divSelCuotas.innerHTML = null;
}

// setea eventos sobre el boton de enviar pedido
const btn = document.querySelector('#myBtn')
document.getElementById('myBtn').onclick = function () {
    setTimeout(submitForm, 2000);
}
btn.addEventListener('click', () => {
    Swal.fire({
        title: '&#10024¡Gracias por tu compra!&#10024',
        text: 'Te contactaremos a la brevedad',
        icon: 'success',
        iconColor: 'pink',
        background: '#FFEEF8',
        showConfirmButton: false,
    });
})

// funcion para realizar el pedido
function submitForm() {
    // ultimo paso en la compra
    // vacía el carrito y retorna al index de la página
    carritoObjeto.vaciarElCarrito();
    document.getElementById("finIndex").click()
}