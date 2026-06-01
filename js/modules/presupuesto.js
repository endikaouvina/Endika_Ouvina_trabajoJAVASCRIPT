'use strict';

import { validarProducto } from './formValidation.js';
import { validarPlazo } from './formValidation.js';

// Variables generales
export let carritoProductos = [];
let extrasSeleccionados;
let subtotalProductos = 0;
let subtotalExtras = 0;

// Elementos del DOM
let selectProducto;
let botonAgregar;
let inputPlazo;
let inputsExtras;
let presupuesto;

// Función para cargar los elementos del DOM
function cargarElementosDOMPresupuesto() {
    selectProducto = document.querySelector('#producto');
    botonAgregar = document.querySelector('#botonAgregar');
    inputPlazo = document.querySelector('#plazo');
    inputsExtras = document.querySelectorAll('#extras [type = "checkbox"]');
    presupuesto = document.querySelector('#presupuesto');
}

// Función para agregar un producto a carritoProductos
function agregarProducto() {
    const opcionSeleccionada = selectProducto.options[selectProducto.selectedIndex];
    const valorSeleccionado = opcionSeleccionada.value;
    const [nombreProducto, precioProducto] = valorSeleccionado.split(' - ');
    const precio = parseFloat(precioProducto);
    carritoProductos.push({ nombre: nombreProducto, precio });
    console.log(carritoProductos);
    calcularPresupuesto();
}

// Función para eliminar un producto de carritoProductos
function eliminarProducto(index) {
    carritoProductos.splice(index, 1);
    calcularPresupuesto();
}

// Función para crear una fila
function crearFila(tipo, celda1, celda2, color, separador, producto, moneda) {
    // Declaramos variables
    const fila = document.createElement('tr');
    let botonEliminar = '';
    let contentCelda2;

    // Añadimos background a la fila
    fila.classList.add('table-' + color);

    // Añadimos separador a la fila
    if (separador) {
        fila.classList.add('table-group-divider');
    }

    // Añadimos el botón para eliminar productos
    if (producto) {
        botonEliminar = '<i class="botonEliminar fa-solid fa-circle-minus fa-xl me-3"></i>';
    }

    // Formateamos el precio si lo hay
    if (moneda) {
        contentCelda2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(celda2);
    } else {
        contentCelda2 = celda2;
    }

    // Insertamos el contenido de la fila y la devolvemos
    fila.innerHTML = `
        <${tipo}>${botonEliminar}${celda1}</${tipo}>
        <${tipo}>${contentCelda2}</${tipo}>
    `;

    return fila;
}

// Función para insertar elementos al body
function insertarElementos(body, elementos, cabecera, pie) {
    // Reseteamos los subtotales a 0
    let subtotalElementos = 0;

    // Insertamos la cabecera de los elementos
    body.appendChild(crearFila('th', cabecera, 'Precio', 'dark', false, false, false));

    // Insertamos cada elemento al body de la tabla y el precio a los subtotales
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

    // Insertamos el pie de los elementos
    body.appendChild(crearFila('th', pie, subtotalElementos, 'secondary', true, false, true));
}

// Función para calcular el presupuesto
function calcularPresupuesto() {
    if (carritoProductos.length > 0 && validarPlazo(true)) {
        // Limpiamos el presupuesto y reseteamos variables
        presupuesto.innerHTML = '';
        subtotalProductos = 0;
        subtotalExtras = 0;

        // Creamos el comienzo de la tabla
        const tabla = document.createElement('table');
        tabla.classList.add('table', 'table-sm', 'table-bordered', 'align-middle');
        const body = document.createElement('tbody');

        // Insertamos los productos
        insertarElementos(body, carritoProductos, 'Producto', 'Subtotal productos');

        // Insertamos los extras
        extrasSeleccionados = document.querySelectorAll('#extras [type = "checkbox"]:checked');
        if (extrasSeleccionados.length > 0) {
            insertarElementos(body, extrasSeleccionados, 'Extra', 'Subtotal extras');
        }

        // Insertamos el plazo
        let plazo = parseInt(inputPlazo.value);
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

        // Calculamos e insertamos el presupuesto final
        let subtotalPresupuesto = subtotalProductos + subtotalExtras;
        let precioDescuento = ((subtotalPresupuesto * descuento) / 100).toFixed(2);
        let presupuestoFinal = subtotalPresupuesto - precioDescuento;
        body.appendChild(crearFila('th', 'Presupuesto', 'Precio', 'dark', false, false, false));
        body.appendChild(crearFila('th', 'Subtotal presupuesto', subtotalPresupuesto, 'secondary', false, false, true));
        body.appendChild(crearFila('th', 'Descuento a aplicar', precioDescuento, 'secondary', true, false, true));
        body.appendChild(crearFila('th', 'Presupuesto final', presupuestoFinal, 'dark', false, false, true));

        // Completamos la tabla y la mostramos por pantalla
        tabla.appendChild(body);
        presupuesto.appendChild(tabla);

        // Añadimos la funcionalidad para eliminar productos
        document.querySelectorAll('.botonEliminar').forEach((boton) => {
            boton.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                eliminarProducto(index);
            });
        });
    } else {
        resetearPresupuesto();
    }
}

// Función para resetear el presupuesto
export function resetearPresupuesto() {
    presupuesto.innerHTML = `
            <div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás añadir y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>
        `;
}

// Función para resetear el carrito
export function resetearCarrito() {
    carritoProductos = [];
}

// Función "main" de la lógica para calcular el presupuesto
export function prepararPresupuesto() {
    cargarElementosDOMPresupuesto();
    botonAgregar.addEventListener('click', () => {
        if (validarProducto(false)) {
            agregarProducto();
        }
    });
    inputPlazo.addEventListener('input', () => {
        if (validarPlazo(false)) {
            calcularPresupuesto();
        } else {
            resetearPresupuesto();
        }
    });
    inputsExtras.forEach((checkbox) => {
        checkbox.addEventListener('change', calcularPresupuesto);
    });
    calcularPresupuesto();
}
