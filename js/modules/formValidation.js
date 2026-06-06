'use strict';

// Dependencias de la aplicación
import { carritoProductos } from './presupuesto.js';
import { resetearPresupuesto } from './presupuesto.js';
import { resetearCarrito } from './presupuesto.js';

// Elementos del DOM
const FORMULARIO = document.querySelector('#form');
const NOMBRE_INPUT = document.querySelector('#nombre');
const NOMBRE_ERROR = document.querySelector('#errorNombre');
const APELLIDOS_INPUT = document.querySelector('#apellidos');
const APELLIDOS_ERROR = document.querySelector('#errorApellidos');
const TELEFONO_INPUT = document.querySelector('#telefono');
const TELEFONO_ERROR = document.querySelector('#errorTelefono');
const EMAIL_INPUT = document.querySelector('#email');
const EMAIL_ERROR = document.querySelector('#errorEmail');
const PRODUCTO_INPUT = document.querySelector('#producto');
const PRODUCTO_ERROR = document.querySelector('#errorProducto');
const PLAZO_INPUT = document.querySelector('#plazo');
const PLAZO_ERROR = document.querySelector('#errorPlazo');
const CONDICIONES_INPUT = document.querySelector('#condiciones');
const CONDICIONES_ERROR = document.querySelector('#errorCondiciones');
const BTN_AGREGAR = document.querySelector('#botonAgregar');
const BTN_RESET = document.querySelector('#btnReset');
const BTN_SUBMIT = document.querySelector('#btnSubmit');
const PRESUPUESTO = document.querySelector('#presupuesto');

// Variables globales
const NOMBRE_TEST_LENGTH = [/^.{1,15}$/, 'Entre 1 y 15 caracteres, ambos inclusive.'];
const NOMBRE_TEST_CHAR = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y/o espacios.'];
const APELLIDOS_TEST_LENGTH = [/^.{1,40}$/, 'Entre 1 y 40 caracteres, ambos inclusive.'];
const APELLIDOS_TEST_CHAR_1 = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y espacios.'];
const APELLIDOS_TEST_CHAR_2 = [/^\p{L}+(?: \p{L}+)+$/u, 'Mínimo 2 apellidos.'];
const TELEFONO_TEST_LENGH = [/^.{9}$/, 'Únicamente 9 caracteres.'];
const TELEFONO_TEST_CHAR_1 = [/^[0-9]+$/, 'Únicamente números.'];
const TELEFONO_TEST_CHAR_2 = [/^[6-9]/, 'Empieza por 6, 7, 8 o 9.'];
const EMAIL_TEST_LENGTH = [/^.{6,}$/, 'Mínimo 6 caracteres.'];
const EMAIL_TEST_CHAR = [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/, 'Formato x@x.xx'];
const PRODUCTO_TEST_CHAR = [/^.+$/, 'Producto seleccionado.'];
const PLAZO_TEST_CHAR_1 = [/^[0-9]+$/, 'Únicamente números.'];
const PLAZO_TEST_CHAR_2 = [/^(?:[1-9]|[12][0-9]|30)$/, 'Entre el 1 y el 30, ambos inclusive.'];
const MSG_PRESUPUESTO = '<div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás agregar y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>';
let camposVacios = [];
let camposNoValidados = [];

// Función para validar el campo pasado por parámetro
function validarCampo(submit, campo, campoError, regEx1, regEx2, regEx3) {
    // Variables locales
    let testRegEx1, testRegEx2, testRegEx3;
    let errorMsg = '';

    // Formateo del texto introducido
    let formateo = campo.value.replace(/\s+/g, ' ');
    if (campo.type === 'tel' || campo.type === 'email') {
        formateo.trim();
    }
    campo.value = formateo;

    // Si se envía el formulario, el campo contiene texto o es un campo de tipo select, se comprueba su validación
    if (submit || campo.value.length > 0 || campo.tagName === 'SELECT') {
        // Al enviar el formulario, se comprueba si está vacío el campo que no sea tipo select
        if (submit && campo.value.length === 0 && campo.tagName !== 'SELECT') {
            errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Campo completado.</span>';
        }

        // Se testean los regEx que pueda tener el campo
        testRegEx1 = regEx1[0].test(formateo);
        if (regEx2 !== undefined) {
            testRegEx2 = regEx2[0].test(formateo);
        }
        if (regEx3 !== undefined) {
            testRegEx3 = regEx3[0].test(formateo);
        }

        // Si se valida el campo, se actualizan las clases y se devuelve true
        if (((!submit && testRegEx1) || (submit && ((testRegEx1 && campo.tagName !== 'SELECT') || (testRegEx1 && campo.tagName === 'SELECT' && carritoProductos.length > 0)))) && (regEx2 === undefined || (regEx2 !== undefined && testRegEx2)) && (regEx3 === undefined || (regEx3 !== undefined && testRegEx3))) {
            if (campo.tagName !== 'SELECT') {
                campo.classList.add('is-valid');
            }
            campo.classList.remove('is-invalid');
            campoError.classList.remove('mt-1');
            campoError.innerHTML = '';
            return true;
        }

        // Si no se valida el campo, se crea un mensaje de error con los test definidos
        if ((!submit && testRegEx1) || (submit && ((testRegEx1 && campo.tagName !== 'SELECT') || (testRegEx1 && campo.tagName === 'SELECT' && carritoProductos.length > 0)))) {
            errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regEx1[1] + '</span>';
        } else {
            errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regEx1[1] + '</span>';
        }
        if (regEx2 !== undefined) {
            if (testRegEx2) {
                errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regEx2[1] + '</span>';
            } else {
                errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regEx2[1] + '</span>';
            }
        }
        if (regEx3 !== undefined) {
            if (testRegEx3) {
                errorMsg += '<span class="text-success"><i class="fa-solid fa-check me-2"></i>' + regEx3[1] + '</span>';
            } else {
                errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>' + regEx3[1] + '</span>';
            }
        }

        // Se actualizan las clases y se muestra el mensaje de error
        campo.classList.add('is-invalid');
        campo.classList.remove('is-valid');
        campoError.classList.add('mt-1');
        campoError.innerHTML = errorMsg;
    } else {
        // Si no se envía el formulario, el campo está vacío y no es un campo de tipo select, se eliminan las clases y el mensaje de error
        campo.classList.remove('is-valid', 'is-invalid');
        campoError.classList.remove('mt-1');
        campoError.innerHTML = '';
    }

    // Si no se valida el campo, se devuelve false
    return false;
}

// Función para validar el nombre
function validarNombre(submit) {
    if (!validarCampo(submit, NOMBRE_INPUT, NOMBRE_ERROR, NOMBRE_TEST_LENGTH, NOMBRE_TEST_CHAR)) {
        if (NOMBRE_INPUT.value.length === 0) {
            camposVacios.push(NOMBRE_INPUT.placeholder);
        } else {
            camposNoValidados.push(NOMBRE_INPUT.placeholder);
        }
    }
}

// Función para validar los apellidos
function validarApellidos(submit) {
    if (!validarCampo(submit, APELLIDOS_INPUT, APELLIDOS_ERROR, APELLIDOS_TEST_LENGTH, APELLIDOS_TEST_CHAR_1, APELLIDOS_TEST_CHAR_2)) {
        if (APELLIDOS_INPUT.value.length === 0) {
            camposVacios.push(APELLIDOS_INPUT.placeholder);
        } else {
            camposNoValidados.push(APELLIDOS_INPUT.placeholder);
        }
    }
}

// Función para validar el teléfono
function validarTelefono(submit) {
    if (!validarCampo(submit, TELEFONO_INPUT, TELEFONO_ERROR, TELEFONO_TEST_LENGH, TELEFONO_TEST_CHAR_1, TELEFONO_TEST_CHAR_2)) {
        if (TELEFONO_INPUT.value.length === 0) {
            camposVacios.push(TELEFONO_INPUT.placeholder);
        } else {
            camposNoValidados.push(TELEFONO_INPUT.placeholder);
        }
    }
}

// Función para validar el email
function validarEmail(submit) {
    if (!validarCampo(submit, EMAIL_INPUT, EMAIL_ERROR, EMAIL_TEST_LENGTH, EMAIL_TEST_CHAR)) {
        if (EMAIL_INPUT.value.length === 0) {
            camposVacios.push(EMAIL_INPUT.placeholder);
        } else {
            camposNoValidados.push(EMAIL_INPUT.placeholder);
        }
    }
}

// Función para validar el producto
function validarProducto(submit) {
    if (validarCampo(submit, PRODUCTO_INPUT, PRODUCTO_ERROR, PRODUCTO_TEST_CHAR)) {
        return true;
    }
    return false;
}

// Función para validar el plazo
function validarPlazo(submit) {
    if (!validarCampo(submit, PLAZO_INPUT, PLAZO_ERROR, PLAZO_TEST_CHAR_1, PLAZO_TEST_CHAR_2)) {
        if (PLAZO_INPUT.value.length === 0) {
            camposVacios.push(PLAZO_INPUT.placeholder);
        } else {
            camposNoValidados.push(PLAZO_INPUT.placeholder);
        }
        return false;
    }
    return true;
}

// Función para resetear el formulario
function resetearFormulario() {
    // Se resetean las variables
    camposVacios = [];
    camposNoValidados = [];

    // Se eliminan todas las clases
    NOMBRE_INPUT.classList.remove('is-valid', 'is-invalid');
    NOMBRE_ERROR.classList.remove('mt-1');
    APELLIDOS_INPUT.classList.remove('is-valid', 'is-invalid');
    APELLIDOS_ERROR.classList.remove('mt-1');
    TELEFONO_INPUT.classList.remove('is-valid', 'is-invalid');
    TELEFONO_ERROR.classList.remove('mt-1');
    EMAIL_INPUT.classList.remove('is-valid', 'is-invalid');
    EMAIL_ERROR.classList.remove('mt-1');
    PRODUCTO_INPUT.classList.remove('is-valid', 'is-invalid');
    PRODUCTO_ERROR.classList.remove('mt-1');
    PLAZO_INPUT.classList.remove('is-valid', 'is-invalid');
    PLAZO_ERROR.classList.remove('mt-1');
    CONDICIONES_INPUT.classList.remove('is-invalid');
    CONDICIONES_ERROR.classList.remove('mt-1');

    // Se eliminan los mensajes de error
    NOMBRE_ERROR.innerHTML = '';
    APELLIDOS_ERROR.innerHTML = '';
    TELEFONO_ERROR.innerHTML = '';
    EMAIL_ERROR.innerHTML = '';
    PRODUCTO_ERROR.innerHTML = '';
    PLAZO_ERROR.innerHTML = '';
    CONDICIONES_ERROR.innerHTML = '';

    // Se resetean el presupuesto, el carrito y el formulario
    resetearPresupuesto();
    resetearCarrito();
    FORMULARIO.reset();
}

// Función para enviar el formulario
function enviarFormulario() {
    // Se resetean las variables
    camposVacios = [];
    camposNoValidados = [];

    // Se valida cada campo
    validarNombre(true);
    validarApellidos(true);
    validarTelefono(true);
    validarEmail(true);
    validarProducto(true);
    validarPlazo(true);

    // Si todo está validado, se envía el formulario
    if (camposNoValidados.length === 0 && carritoProductos.length > 0 && CONDICIONES_INPUT.checked) {
        /*
            Aquí se crearía un JSON y se enviaría al archivo correspondiente del servidor para que el formulario quede registrado donde corresponda
        */
        resetearFormulario();
        alert('Formulario enviado correctamente.');
    } else {
        // Si algún campo no está validado o no se ha seleccionado ningún producto, se genera el mensaje de error
        let msgEnvio = '';

        // Función para el comienzo de los errores de campos vacíos y campos no validados
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

        // Se detectan los campos vacíos
        msgCampos(camposVacios);
        if (camposVacios.length === 1) {
            msgEnvio += ' no está completado.';
        } else if (camposVacios.length > 1) {
            msgEnvio += ' no están completados.';
        }

        // Se detectan los campos no validados
        if (camposVacios.length > 0 && camposNoValidados.length > 0) {
            msgEnvio += ' ';
        }
        msgCampos(camposNoValidados);
        if (camposNoValidados.length === 1) {
            msgEnvio += ' tiene un formato no válido.';
        } else if (camposNoValidados.length > 1) {
            msgEnvio += ' tienen formatos no válidos.';
        }

        // Se detecta si se ha seleccionado algún producto
        if ((camposVacios.length > 0 || camposNoValidados.length > 0) && carritoProductos.length === 0) {
            msgEnvio += ' ';
        }
        if (carritoProductos.length === 0) {
            msgEnvio += 'No se ha seleccionado ningún producto.';
        }

        // Se detecta si se han aceptado las condiciones
        if ((camposVacios.length > 0 || camposNoValidados.length > 0 || carritoProductos.length === 0) && !CONDICIONES_INPUT.checked) {
            msgEnvio += ' ';
        }
        if (!CONDICIONES_INPUT.checked) {
            CONDICIONES_INPUT.classList.add('is-invalid');
            CONDICIONES_ERROR.classList.add('mt-1');
            CONDICIONES_ERROR.innerHTML = '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Condiciones de privacidad aceptadas.</span>';
            msgEnvio += 'No se han aceptado las condiciones de privacidad.';
        }

        // Se muestra el mensaje de error
        alert(msgEnvio);
    }
}

// Función para agregar eventos al formulario
function eventosFormulario() {
    NOMBRE_INPUT.addEventListener('input', () => {
        validarNombre(false);
    });
    APELLIDOS_INPUT.addEventListener('input', () => {
        validarApellidos(false);
    });
    TELEFONO_INPUT.addEventListener('input', () => {
        validarTelefono(false);
    });
    EMAIL_INPUT.addEventListener('input', () => {
        validarEmail(false);
    });
    CONDICIONES_INPUT.addEventListener('click', () => {
        CONDICIONES_INPUT.classList.remove('is-invalid');
        CONDICIONES_ERROR.classList.remove('mt-1');
        CONDICIONES_ERROR.innerHTML = '';
    });
    BTN_RESET.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres resetear? Se resetearán todos los campos y se eliminará el presupuesto.')) {
            resetearFormulario();
        }
    });
    BTN_SUBMIT.addEventListener('click', enviarFormulario);
}

// Exportación de dependencias
export { eventosFormulario, validarProducto, validarPlazo };
