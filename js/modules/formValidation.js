'use strict';

import { carritoProductos } from './presupuesto.js';
import { resetearPresupuesto } from './presupuesto.js';
import { resetearCarrito } from './presupuesto.js';

// Variables generales
const nombreTestLength = [/^.{1,15}$/, 'Entre 1 y 15 caracteres, ambos inclusive.'];
const nombreTestChar = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y/o espacios.'];
const apellidosTestLength = [/^.{1,40}$/, 'Entre 1 y 40 caracteres, ambos inclusive.'];
const apellidosTestChar1 = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y espacios.'];
const apellidosTestChar2 = [/^\p{L}+(?: \p{L}+)+$/u, 'Mínimo 2 apellidos.'];
const telefonoTestLength = [/^.{9}$/, 'Únicamente 9 caracteres.'];
const telefonoTestChar1 = [/^[0-9]+$/, 'Únicamente números.'];
const telefonoTestChar2 = [/^[6-9]/, 'Empieza por 6, 7, 8 o 9.'];
const emailTestLength = [/^.{6,}$/, 'Mínimo 6 caracteres.'];
const emailTestChar = [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/, 'Formato x@x.xx'];
const productoTestChar = [/^.+$/, 'Producto seleccionado.'];
const plazoTestChar1 = [/^[0-9]+$/, 'Únicamente números.'];
const plazoTestChar2 = [/^(?:[1-9]|[12][0-9]|30)$/, 'Entre el 1 y el 30, ambos inclusive.'];
const msgPresupuesto = '<div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás añadir y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>';
let camposVacios = [];
let camposNoValidados = [];

// Elementos del DOM
let formulario;
let inputNombre;
let inputApellidos;
let inputTelefono;
let inputEmail;
let inputProducto;
let inputPlazo;
let inputCondiciones;
let botonAgregar;
let errorNombre;
let errorApellidos;
let errorTelefono;
let errorEmail;
let errorProducto;
let errorPlazo;
let errorCondiciones;
let presupuesto;
let btnReset;
let btnSubmit;

// Función para cargar los elementos del DOM
function cargarElementosDOMFormulario() {
    formulario = document.querySelector('#form');
    inputNombre = document.querySelector('#nombre');
    inputApellidos = document.querySelector('#apellidos');
    inputTelefono = document.querySelector('#telefono');
    inputEmail = document.querySelector('#email');
    inputProducto = document.querySelector('#producto');
    inputPlazo = document.querySelector('#plazo');
    inputCondiciones = document.querySelector('#condiciones');
    botonAgregar = document.querySelector('#botonAgregar');
    errorNombre = document.querySelector('#errorNombre');
    errorApellidos = document.querySelector('#errorApellidos');
    errorTelefono = document.querySelector('#errorTelefono');
    errorEmail = document.querySelector('#errorEmail');
    errorProducto = document.querySelector('#errorProducto');
    errorPlazo = document.querySelector('#errorPlazo');
    errorCondiciones = document.querySelector('#errorCondiciones');
    presupuesto = document.querySelector('#presupuesto');
    btnReset = document.querySelector('#btnReset');
    btnSubmit = document.querySelector('#btnSubmit');
}

// Función para validar el campo pasado por parámetro
function validarCampo(submit, campo, campoError, regex1, regex2, regex3) {
    let testRegex1, testRegex2, testRegex3;
    let errorMsg = '';
    let formateo = campo.value.replace(/\s+/g, ' ');
    if (campo.type === 'tel' || campo.type === 'email') {
        formateo.trim();
    }
    campo.value = formateo;
    if (campo.value.length > 0 || campo.tagName === 'SELECT' || submit) {
        if (submit && campo.value.length === 0 && campo.tagName !== 'SELECT') {
            errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Campo completado.</span>';
        }
        testRegex1 = regex1[0].test(formateo);
        if (regex2 !== undefined) {
            testRegex2 = regex2[0].test(formateo);
        }
        if (regex3 !== undefined) {
            testRegex3 = regex3[0].test(formateo);
        }
        if (((!submit && testRegex1) || (submit && ((testRegex1 && campo.tagName !== 'SELECT') || (testRegex1 && campo.tagName === 'SELECT' && carritoProductos.length > 0)))) && (regex2 === undefined || (regex2 !== undefined && testRegex2)) && (regex3 === undefined || (regex3 !== undefined && testRegex3))) {
            if (campo.tagName !== 'SELECT') {
                campo.classList.add('is-valid');
            }
            campo.classList.remove('is-invalid');
            campoError.classList.remove('mt-1');
            campoError.innerHTML = '';
            return true;
        }
        if ((!submit && testRegex1) || (submit && ((testRegex1 && campo.tagName !== 'SELECT') || (testRegex1 && campo.tagName === 'SELECT' && carritoProductos.length > 0)))) {
            errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regex1[1] + '</span>';
        } else {
            errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regex1[1] + '</span>';
        }
        if (regex2 !== undefined) {
            if (testRegex2) {
                errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regex2[1] + '</span>';
            } else {
                errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regex2[1] + '</span>';
            }
        }
        if (regex3 !== undefined) {
            if (testRegex3) {
                errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regex3[1] + '</span>';
            } else {
                errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regex3[1] + '</span>';
            }
        }
        campo.classList.add('is-invalid');
        campo.classList.remove('is-valid');
        campoError.classList.add('mt-1');
        campoError.innerHTML = errorMsg;
    } else {
        campo.classList.remove('is-valid', 'is-invalid');
        campoError.classList.remove('mt-1');
        campoError.innerHTML = '';
    }
    return false;
}

function validarNombre(submit) {
    if (!validarCampo(submit, inputNombre, errorNombre, nombreTestLength, nombreTestChar)) {
        if (inputNombre.value.length === 0) {
            camposVacios.push(inputNombre.placeholder);
        } else {
            camposNoValidados.push(inputNombre.placeholder);
        }
    }
}

function validarApellidos(submit) {
    if (!validarCampo(submit, inputApellidos, errorApellidos, apellidosTestLength, apellidosTestChar1, apellidosTestChar2)) {
        if (inputApellidos.value.length === 0) {
            camposVacios.push(inputApellidos.placeholder);
        } else {
            camposNoValidados.push(inputApellidos.placeholder);
        }
    }
}

function validarTelefono(submit) {
    if (!validarCampo(submit, inputTelefono, errorTelefono, telefonoTestLength, telefonoTestChar1, telefonoTestChar2)) {
        if (inputTelefono.value.length === 0) {
            camposVacios.push(inputTelefono.placeholder);
        } else {
            camposNoValidados.push(inputTelefono.placeholder);
        }
    }
}

function validarEmail(submit) {
    if (!validarCampo(submit, inputEmail, errorEmail, emailTestLength, emailTestChar)) {
        if (inputEmail.value.length === 0) {
            camposVacios.push(inputEmail.placeholder);
        } else {
            camposNoValidados.push(inputEmail.placeholder);
        }
    }
}

export function validarProducto(submit) {
    if (validarCampo(submit, inputProducto, errorProducto, productoTestChar)) {
        return true;
    }
    return false;
}

export function validarPlazo(submit) {
    if (!validarCampo(submit, inputPlazo, errorPlazo, plazoTestChar1, plazoTestChar2)) {
        if (inputPlazo.value.length === 0) {
            camposVacios.push(inputPlazo.placeholder);
        } else {
            camposNoValidados.push(inputPlazo.placeholder);
        }
        return false;
    }
    return true;
}

function resetearFormulario() {
    inputNombre.classList.remove('is-valid', 'is-invalid');
    errorNombre.classList.remove('mt-1');
    errorNombre.innerHTML = '';
    inputApellidos.classList.remove('is-valid', 'is-invalid');
    errorApellidos.classList.remove('mt-1');
    errorApellidos.innerHTML = '';
    inputTelefono.classList.remove('is-valid', 'is-invalid');
    errorTelefono.classList.remove('mt-1');
    errorTelefono.innerHTML = '';
    inputEmail.classList.remove('is-valid', 'is-invalid');
    errorEmail.classList.remove('mt-1');
    errorEmail.innerHTML = '';
    inputProducto.classList.remove('is-valid', 'is-invalid');
    errorProducto.classList.remove('mt-1');
    errorProducto.innerHTML = '';
    inputPlazo.classList.remove('is-valid', 'is-invalid');
    errorPlazo.classList.remove('mt-1');
    errorPlazo.innerHTML = '';
    inputCondiciones.classList.remove('is-invalid');
    errorCondiciones.classList.remove('mt-1');
    errorCondiciones.innerHTML = '';
    camposVacios = [];
    camposNoValidados = [];
    resetearPresupuesto();
    resetearCarrito();
    formulario.reset();
}

function enviarFormulario() {
    camposVacios = [];
    camposNoValidados = [];
    validarNombre(true);
    validarApellidos(true);
    validarTelefono(true);
    validarEmail(true);
    validarProducto(true);
    validarPlazo(true);
    if (camposNoValidados.length === 0 && carritoProductos.length > 0 && inputCondiciones.checked) {
        /*
            Aquí se enviaría el JSON al archivo correspondiente del servidor para que el formulario quede registrado donde corresponda
        */
        resetearFormulario();
        alert('Formulario enviado correctamente.');
    } else {
        let msgEnvio = '';
        function msgCampos(array) {
            if (array.length === 1) {
                msgEnvio += 'El campo ';
            } else if (array.length > 1) {
                msgEnvio += 'Los campos ';
            }
            array.forEach((campo, index) => {
                msgEnvio += campo;
                if (index < array.length - 2) {
                    msgEnvio += ', ';
                } else if (index < array.length - 1) {
                    msgEnvio += ' y ';
                }
            });
        }
        msgCampos(camposVacios);
        if (camposVacios.length === 1) {
            msgEnvio += ' no está completado.';
        } else if (camposVacios.length > 1) {
            msgEnvio += ' no están completados.';
        }
        if (camposVacios.length > 0 && camposNoValidados.length > 0) {
            msgEnvio += ' ';
        }
        msgCampos(camposNoValidados);
        if (camposNoValidados.length === 1) {
            msgEnvio += ' tiene un formato no válido.';
        } else if (camposNoValidados.length > 1) {
            msgEnvio += ' tienen formatos no válidos.';
        }
        if ((camposVacios.length > 0 || camposNoValidados.length > 0) && carritoProductos.length === 0) {
            msgEnvio += ' ';
        }
        if (carritoProductos.length === 0) {
            msgEnvio += 'No se ha seleccionado ningún producto.';
        }
        if ((camposVacios.length > 0 || camposNoValidados.length > 0 || carritoProductos.length === 0) && !inputCondiciones.checked) {
            msgEnvio += ' ';
        }
        if (!inputCondiciones.checked) {
            inputCondiciones.classList.add('is-invalid');
            errorCondiciones.classList.add('mt-1');
            errorCondiciones.innerHTML = '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Condiciones de privacidad aceptadas.</span>';
            msgEnvio += 'No se han aceptado las condiciones de privacidad.';
        }
        alert(msgEnvio);
    }
}

// Función "main" de la lógica para validar el formulario
export function prepararFormulario() {
    cargarElementosDOMFormulario();
    inputNombre.addEventListener('input', () => {
        validarNombre(false);
    });
    inputApellidos.addEventListener('input', () => {
        validarApellidos(false);
    });
    inputTelefono.addEventListener('input', () => {
        validarTelefono(false);
    });
    inputEmail.addEventListener('input', () => {
        validarEmail(false);
    });
    inputCondiciones.addEventListener('click', () => {
        inputCondiciones.classList.remove('is-invalid');
        errorCondiciones.classList.remove('mt-1');
        errorCondiciones.innerHTML = '';
    });
    btnReset.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres resetear? Se resetearán todos los campos y se eliminará el presupuesto.')) {
            resetearFormulario();
        }
    });
    btnSubmit.addEventListener('click', enviarFormulario);
}
