'use strict';

import { resetearPresupuesto } from './presupuesto.js';

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
let camposNoValidados = [];

// Elementos del DOM
let formulario;
let inputNombre;
let inputApellidos;
let inputTelefono;
let inputEmail;
let inputProducto;
let botonAgregar;
let inputPlazo;
let errorNombre;
let errorApellidos;
let errorTelefono;
let errorEmail;
let errorProducto;
let errorPlazo;
let inputCondiciones;
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
    botonAgregar = document.querySelector('#botonAgregar');
    inputPlazo = document.querySelector('#plazo');
    errorNombre = document.querySelector('#errorNombre');
    errorApellidos = document.querySelector('#errorApellidos');
    errorTelefono = document.querySelector('#errorTelefono');
    errorEmail = document.querySelector('#errorEmail');
    errorProducto = document.querySelector('#errorProducto');
    errorPlazo = document.querySelector('#errorPlazo');
    inputCondiciones = document.querySelector('#condiciones');
    presupuesto = document.querySelector('#presupuesto');
    btnReset = document.querySelector('#btnReset');
    btnSubmit = document.querySelector('#btnSubmit');
}

// Función para validar el campo pasado por parámetro
function validarCampo(campo, campoError, regex1, regex2, regex3) {
    let testRegex1, testRegex2, testRegex3;
    let errorMsg = '';
    let formateo = campo.value.replace(/\s+/g, ' ');
    if (campo.type === 'tel' || campo.type === 'email') {
        formateo.trim();
    }
    campo.value = formateo;
    if (campo.value.length > 0 || campo.tagName === 'SELECT') {
        testRegex1 = regex1[0].test(formateo);
        if (regex2 !== undefined) {
            testRegex2 = regex2[0].test(formateo);
        }
        if (regex3 !== undefined) {
            testRegex3 = regex3[0].test(formateo);
        }
        if (testRegex1 && (regex2 === undefined || (regex2 !== undefined && testRegex2)) && (regex3 === undefined || (regex3 !== undefined && testRegex3))) {
            if (campo.tagName !== 'SELECT') {
                campo.classList.add('is-valid');
            }
            campo.classList.remove('is-invalid');
            campoError.classList.remove('mt-1');
            campoError.innerHTML = '';
            return true;
        }
        if (testRegex1) {
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

function validarNombre() {
    if (!validarCampo(inputNombre, errorNombre, nombreTestLength, nombreTestChar)) {
        camposNoValidados.push(inputNombre.placeholder);
    }
}

function validarApellidos() {
    if (!validarCampo(inputApellidos, errorApellidos, apellidosTestLength, apellidosTestChar1, apellidosTestChar2)) {
        camposNoValidados.push(inputApellidos.placeholder);
    }
}

function validarTelefono() {
    if (!validarCampo(inputTelefono, errorTelefono, telefonoTestLength, telefonoTestChar1, telefonoTestChar2)) {
        camposNoValidados.push(inputTelefono.placeholder);
    }
}

function validarEmail() {
    if (!validarCampo(inputEmail, errorEmail, emailTestLength, emailTestChar)) {
        camposNoValidados.push(inputEmail.placeholder);
    }
}

function validarProducto() {
    if (!validarCampo(inputProducto, errorProducto, productoTestChar)) {
        camposNoValidados.push('Producto');
    }
}

function validarPlazo() {
    if (!validarCampo(inputPlazo, errorPlazo, plazoTestChar1, plazoTestChar2)) {
        camposNoValidados.push(inputNombre.placeholder);
    }
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
    camposNoValidados = [];
    resetearPresupuesto();
    formulario.reset();
}

function enviarFormulario() {
    camposNoValidados = [];
    validarNombre();
    validarApellidos();
    validarTelefono();
    validarEmail();
    validarPlazo();
    if (camposNoValidados.length === 0 && inputCondiciones.checked) {
        /*
            Aquí se enviaría el JSON al archivo correspondiente del servidor para que el formulario quede registrado donde corresponda
        */
        resetearFormulario();
        alert('Formulario enviado correctamente.');
    } else {
        let msgEnvio = '';
        if (camposNoValidados.length === 1) {
            msgEnvio += 'El campo ';
        } else if (camposNoValidados.length > 1) {
            msgEnvio += 'Los campos ';
        }
        camposNoValidados.forEach((campo, index) => {
            msgEnvio += campo;
            if (index < camposNoValidados.length - 2) {
                msgEnvio += ', ';
            } else if (index < camposNoValidados.length - 1) {
                msgEnvio += ' y ';
            }
        });
        if (camposNoValidados.length === 1) {
            msgEnvio += ' tiene un formato no válido.';
        } else if (camposNoValidados.length > 1) {
            msgEnvio += ' tienen formatos no válidos.';
        }
        if (camposNoValidados.length > 0 && !inputCondiciones.checked) {
            msgEnvio += ' ';
        }
        if (!inputCondiciones.checked) {
            msgEnvio += 'No se han aceptado las condiciones de privacidad.';
        }
        alert(msgEnvio);
    }
}

// Función "main" de la lógica para validar el formulario
export function prepararFormulario() {
    cargarElementosDOMFormulario();
    inputNombre.addEventListener('input', validarNombre);
    inputApellidos.addEventListener('input', validarApellidos);
    inputTelefono.addEventListener('input', validarTelefono);
    inputEmail.addEventListener('input', validarEmail);
    botonAgregar.addEventListener('click', validarProducto);
    inputPlazo.addEventListener('input', validarPlazo);
    btnReset.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres resetear? Se resetearán todos los campos y se eliminará el presupuesto.')) {
            resetearFormulario();
        }
    });
    btnSubmit.addEventListener('click', enviarFormulario);
}
