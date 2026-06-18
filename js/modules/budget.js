'use strict';

// Dependencias de la aplicación
import { validateProduct } from './formValidation.js';
import { validateDeliveryTime } from './formValidation.js';

// Elementos del DOM
const PRODUCT_SELECT = document.querySelector('#product');
const BTN_ADD_PRODUCT = document.querySelector('#btn-add-product');
const DELIVERY_TIME_INPUT = document.querySelector('#delivery-time');
const EXTRAS_INPUTS = document.querySelectorAll('#extras-options [type = "checkbox"]');
const BUDGET = document.querySelector('#budget');

// Variables globales
let cartItems = [];
let selectedExtrasOptions;
let productsSubtotal = 0;
let extrasOptionsSubtotal = 0;

// Función para agregar un producto a carritoProductos
function addProduct() {
    const selectedOption = PRODUCT_SELECT.options[PRODUCT_SELECT.selectedIndex];
    const selectedValue = selectedOption.value;
    const [productName, productPrice] = selectedValue.split(' - ');
    const price = parseFloat(productPrice);
    cartItems.push({ nombre: productName, precio: price });
    calculateBudget();
}

// Función para eliminar un producto de carritoProductos
function deleteProduct(index) {
    cartItems.splice(index, 1);
    calculateBudget();
}

// Función para crear una fila
function createRow(type, cell1, cell2, color, divider, product, price) {
    // Variables locales
    const row = document.createElement('tr');
    let btnDelete = '';
    let contentCell2;

    // Se agrega un background a la fila
    row.classList.add('table-' + color);

    // Se agrega un separador a la fila
    if (divider) {
        row.classList.add('table-group-divider');
    }

    // Se agrega un botón para eliminar el producto correspondiente
    if (product) {
        btnDelete = '<i class="budget__btn-delete-product fa-solid fa-circle-minus fa-xl me-3"></i>';
    }

    // Se formatea el precio si lo hay
    if (price) {
        contentCell2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cell2);
    } else {
        contentCell2 = cell2;
    }

    // Se inserta el contenido de la fila
    row.innerHTML = `
        <${type}>${btnDelete}${cell1}</${type}>
        <${type}>${contentCell2}</${type}>
    `;

    // Se devuelve la fila
    return row;
}

// Función para insertar elementos al body de la tabla
function insertElemBlock(body, elem, thead, tfoot) {
    // Se resetean variables
    let elemSubtotal = 0;

    // Se inserta la cabecera de los elementos
    body.appendChild(createRow('th', thead, 'Precio', 'dark', false, false, false));

    // Se inserta cada elemento al body de la tabla y el precio a los subtotales
    elem.forEach((item, index) => {
        let actual;
        let btnDelete = false;
        if (thead === 'Producto') {
            actual = [item.nombre, item.precio];
            elemSubtotal += item.precio;
            productsSubtotal += item.precio;
            btnDelete = true;
        } else if (thead === 'Extra') {
            actual = item.value.split(' - ');
            elemSubtotal += parseFloat(actual[1]);
            extrasOptionsSubtotal += parseFloat(actual[1]);
        }
        body.appendChild(createRow('td', actual[0], actual[1], 'light', false, btnDelete, true));
    });

    // Se inserta el pie de los elementos
    body.appendChild(createRow('th', tfoot, elemSubtotal, 'secondary', true, false, true));
}

// Función para calcular el presupuesto
function calculateBudget() {
    if (cartItems.length > 0 && validateDeliveryTime(true)) {
        // Si se ha seleccionado algún producto y el campo Plazo está validado, se elimina el presupuesto y se resetean variables
        BUDGET.innerHTML = '';
        productsSubtotal = 0;
        extrasOptionsSubtotal = 0;

        // Se crea el comienzo de la tabla
        const table = document.createElement('table');
        table.classList.add('table', 'table-sm', 'table-bordered', 'align-middle');
        const body = document.createElement('tbody');

        // Se insertan los productos
        insertElemBlock(body, cartItems, 'Producto', 'Subtotal productos');

        // Se insertan los extras
        selectedExtrasOptions = document.querySelectorAll('#extras-options [type = "checkbox"]:checked');
        if (selectedExtrasOptions.length > 0) {
            insertElemBlock(body, selectedExtrasOptions, 'Extra', 'Subtotal extras');
        }

        // Se inserta el plazo
        let deliveryTime = parseInt(DELIVERY_TIME_INPUT.value);
        let discount;
        if (deliveryTime <= 12) {
            discount = 2;
        } else if (deliveryTime <= 20) {
            discount = 5;
        } else {
            discount = 10;
        }
        body.appendChild(createRow('th', 'Plazo', 'Descuento', 'dark', false, false, false));
        body.appendChild(createRow('th', deliveryTime + ' días', discount + ' %', 'secondary', false, false, false));

        // Se calcula y se inserta el presupuesto final
        let budgetSubtotal = productsSubtotal + extrasOptionsSubtotal;
        let priceDiscount = ((budgetSubtotal * discount) / 100).toFixed(2);
        let finalPrice = budgetSubtotal - priceDiscount;
        body.appendChild(createRow('th', 'Presupuesto', 'Precio', 'dark', false, false, false));
        body.appendChild(createRow('th', 'Subtotal presupuesto', budgetSubtotal, 'secondary', false, false, true));
        body.appendChild(createRow('th', 'Descuento a aplicar', priceDiscount, 'secondary', true, false, true));
        body.appendChild(createRow('th', 'Presupuesto final', finalPrice, 'dark', false, false, true));

        // Se completa la tabla y se muestra en la página
        table.appendChild(body);
        BUDGET.appendChild(table);

        // Se agrega la funcionalidad para eliminar productos
        document.querySelectorAll('.budget__btn-delete-product').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                deleteProduct(index);
            });
        });
    } else {
        // Si no se ha seleccionado ningún producto o el campo Plazo no se ha validado, se resetea el presupuesto
        resetBudget();
    }
}

// Función para resetear el presupuesto
function resetBudget() {
    BUDGET.innerHTML = `
            <div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás añadir y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>
        `;
}

// Función para resetear el carrito
function resetCart() {
    cartItems = [];
}

// Función agregar eventos al formulario
function budgetEvents() {
    BTN_ADD_PRODUCT.addEventListener('click', () => {
        if (validateProduct(false)) {
            addProduct();
        }
    });
    DELIVERY_TIME_INPUT.addEventListener('input', () => {
        if (validateDeliveryTime(false)) {
            calculateBudget();
        } else {
            resetBudget();
        }
    });
    EXTRAS_INPUTS.forEach((checkbox) => {
        checkbox.addEventListener('change', calculateBudget);
    });
    resetBudget();
}

// Exportación de dependencias
export { cartItems, resetBudget, resetCart, budgetEvents };
