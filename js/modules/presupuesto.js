'use strict';

// Dependencias de la aplicación
import { validarProducto } from './formValidation.js';
import { validarPlazo } from './formValidation.js';

// Elementos del DOM
const PRODUCTO_SELECT = document.querySelector('#producto');
const BTN_AGREGAR = document.querySelector('#botonAgregar');
const PLAZO_INPUT = document.querySelector('#plazo');
const EXTRAS_INPUTS = document.querySelectorAll('#extras [type = "checkbox"]');
const PRESUPUESTO = document.querySelector('#presupuesto');

// Variables globales
let carritoProductos = [];
let extrasSeleccionados;
let subtotalProductos = 0;
let subtotalExtras = 0;

// Función para agregar un producto a carritoProductos
function agregarProducto() {
    const opcionSeleccionada = PRODUCTO_SELECT.options[PRODUCTO_SELECT.selectedIndex];
    const valorSeleccionado = opcionSeleccionada.value;
    const [nombreProducto, precioProducto] = valorSeleccionado.split(' - ');
    const precio = parseFloat(precioProducto);
    carritoProductos.push({ nombre: nombreProducto, precio });
    calcularPresupuesto();
}

// Función para eliminar un producto de carritoProductos
function eliminarProducto(index) {
    carritoProductos.splice(index, 1);
    calcularPresupuesto();
}

// Función para crear una fila
function crearFila(tipo, celda1, celda2, color, separador, producto, moneda) {
    // Variables locales
    const fila = document.createElement('tr');
    let botonEliminar = '';
    let contentCelda2;

    // Se agrega un background a la fila
    fila.classList.add('table-' + color);

    // Se agrega un separador a la fila
    if (separador) {
        fila.classList.add('table-group-divider');
    }

    // Se agrega un botón para eliminar el producto correspondiente
    if (producto) {
        botonEliminar = '<i class="botonEliminar fa-solid fa-circle-minus fa-xl me-3"></i>';
    }

    // Se formatea el precio si lo hay
    if (moneda) {
        contentCelda2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(celda2);
    } else {
        contentCelda2 = celda2;
    }

    // Se inserta el contenido de la fila
    fila.innerHTML = `
        <${tipo}>${botonEliminar}${celda1}</${tipo}>
        <${tipo}>${contentCelda2}</${tipo}>
    `;

    // Se devuelve la fila
    return fila;
}

// Función para insertar elementos al body de la tabla
function insertarElementos(body, elementos, cabecera, pie) {
    // Se resetean variables
    let subtotalElementos = 0;

    // Se inserta la cabecera de los elementos
    body.appendChild(crearFila('th', cabecera, 'Precio', 'dark', false, false, false));

    // Se inserta cada elemento al body de la tabla y el precio a los subtotales
    elementos.forEach((elemento, index) => {
        let actual;
        let botonEliminar = false;
        if (cabecera === 'Producto') {
            actual = [elemento.nombre, elemento.precio];
            subtotalElementos += elemento.precio;
            subtotalProductos += elemento.precio;
            botonEliminar = true;
        } else if (cabecera === 'Extra') {
            actual = elemento.value.split(' - ');
            subtotalElementos += parseFloat(actual[1]);
            subtotalExtras += parseFloat(actual[1]);
        }
        body.appendChild(crearFila('td', actual[0], actual[1], 'light', false, botonEliminar, true));
    });

    // Se inserta el pie de los elementos
    body.appendChild(crearFila('th', pie, subtotalElementos, 'secondary', true, false, true));
}

// Función para calcular el presupuesto
function calcularPresupuesto() {
    if (carritoProductos.length > 0 && validarPlazo(true)) {
        // Si se ha seleccionado algún producto y el campo Plazo está validado, se elimina el presupuesto y se resetean variables
        PRESUPUESTO.innerHTML = '';
        subtotalProductos = 0;
        subtotalExtras = 0;

        // Se crea el comienzo de la tabla
        const tabla = document.createElement('table');
        tabla.classList.add('table', 'table-sm', 'table-bordered', 'align-middle');
        const body = document.createElement('tbody');

        // Se insertan los productos
        insertarElementos(body, carritoProductos, 'Producto', 'Subtotal productos');

        // Se insertan los extras
        extrasSeleccionados = document.querySelectorAll('#extras [type = "checkbox"]:checked');
        if (extrasSeleccionados.length > 0) {
            insertarElementos(body, extrasSeleccionados, 'Extra', 'Subtotal extras');
        }

        // Se inserta el plazo
        let plazo = parseInt(PLAZO_INPUT.value);
        let descuento;
        if (plazo <= 12) {
            descuento = 2;
        } else if (plazo <= 20) {
            descuento = 5;
        } else {
            descuento = 10;
        }
        body.appendChild(crearFila('th', 'Plazo', 'Descuento', 'dark', false, false, false));
        body.appendChild(crearFila('th', plazo + ' días', descuento + ' %', 'secondary', false, false, false));

        // Se calcula y se inserta el presupuesto final
        let subtotalPresupuesto = subtotalProductos + subtotalExtras;
        let precioDescuento = ((subtotalPresupuesto * descuento) / 100).toFixed(2);
        let presupuestoFinal = subtotalPresupuesto - precioDescuento;
        body.appendChild(crearFila('th', 'Presupuesto', 'Precio', 'dark', false, false, false));
        body.appendChild(crearFila('th', 'Subtotal presupuesto', subtotalPresupuesto, 'secondary', false, false, true));
        body.appendChild(crearFila('th', 'Descuento a aplicar', precioDescuento, 'secondary', true, false, true));
        body.appendChild(crearFila('th', 'Presupuesto final', presupuestoFinal, 'dark', false, false, true));

        // Se completa la tabla y se muestra en la página
        tabla.appendChild(body);
        PRESUPUESTO.appendChild(tabla);

        // Se agrega la funcionalidad para eliminar productos
        document.querySelectorAll('.botonEliminar').forEach((boton) => {
            boton.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                eliminarProducto(index);
            });
        });
    } else {
        // Si no se ha seleccionado ningún producto o el campo Plazo no se ha validado, se resetea el presupuesto
        resetearPresupuesto();
    }
}

// Función para resetear el presupuesto
function resetearPresupuesto() {
    PRESUPUESTO.innerHTML = `
            <div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás añadir y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>
        `;
}

// Función para resetear el carrito
function resetearCarrito() {
    carritoProductos = [];
}

// Función agregar eventos al formulario
function eventosPresupuesto() {
    BTN_AGREGAR.addEventListener('click', () => {
        if (validarProducto(false)) {
            agregarProducto();
        }
    });
    PLAZO_INPUT.addEventListener('input', () => {
        if (validarPlazo(false)) {
            calcularPresupuesto();
        } else {
            resetearPresupuesto();
        }
    });
    EXTRAS_INPUTS.forEach((checkbox) => {
        checkbox.addEventListener('change', calcularPresupuesto);
    });
    resetearPresupuesto();
}

// Exportación de dependencias
export { carritoProductos, resetearPresupuesto, resetearCarrito, eventosPresupuesto };
