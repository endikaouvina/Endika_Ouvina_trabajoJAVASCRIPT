'use strict';

// Dependencias de la aplicación
import { cartItems } from './budget.js';
import { resetBudget } from './budget.js';
import { resetCart } from './budget.js';

// Elementos del DOM
const FORM = document.querySelector('#form');
const NAME_INPUT = document.querySelector('#name');
const NAME_ERROR = document.querySelector('#name-error');
const SURNAMES_INPUT = document.querySelector('#surnames');
const SURNAMES_ERROR = document.querySelector('#surnames-error');
const NUMBER_INPUT = document.querySelector('#number');
const NUMBER_ERROR = document.querySelector('#number-error');
const EMAIL_INPUT = document.querySelector('#email');
const EMAIL_ERROR = document.querySelector('#email-error');
const PRODUCT_SELECT = document.querySelector('#product');
const PRODUCT_ERROR = document.querySelector('#product-error');
const DELIVERY_TIME_INPUT = document.querySelector('#delivery-time');
const DELIVERY_TIME_ERROR = document.querySelector('#delivery-time-error');
const CONDITIONS_INPUT = document.querySelector('#conditions');
const CONDITIONS_ERROR = document.querySelector('#conditions-error');
const BTN_ADD_PRODUCT = document.querySelector('#btn-add-product');
const BTN_RESET = document.querySelector('#btn-reset');
const BTN_SUBMIT = document.querySelector('#btn-submit');
const BUDGET = document.querySelector('#budget');

// Variables globales
const NAME_TEST_LENGTH = [/^.{1,15}$/, 'Entre 1 y 15 caracteres, ambos inclusive.'];
const NAME_TEST_CHAR = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y/o espacios.'];
const SURNAMES_TEST_LENGTH = [/^.{1,40}$/, 'Entre 1 y 40 caracteres, ambos inclusive.'];
const SURNAMES_TEST_CHAR_1 = [/^\p{L}+(?: \p{L}+)*$/u, 'Únicamente letras y espacios.'];
const SURNAMES_TEST_CHAR_2 = [/^\p{L}+(?: \p{L}+)+$/u, 'Mínimo 2 apellidos.'];
const NUMBER_TEST_LENGH = [/^.{9}$/, 'Únicamente 9 caracteres.'];
const NUMBER_TEST_CHAR_1 = [/^[0-9]+$/, 'Únicamente números.'];
const NUMBER_TEST_CHAR_2 = [/^[6-9]/, 'Empieza por 6, 7, 8 o 9.'];
const EMAIL_TEST_LENGTH = [/^.{6,}$/, 'Mínimo 6 caracteres.'];
const EMAIL_TEST_CHAR = [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/, 'Formato x@x.xx'];
const PRODUCT_TEST_CHAR = [/^.+$/, 'Producto seleccionado.'];
const DELIVERY_TIME_TEST_CHAR_1 = [/^[0-9]+$/, 'Únicamente números.'];
const DELIVERY_TIME_TEST_CHAR_2 = [/^(?:[1-9]|[12][0-9]|30)$/, 'Entre el 1 y el 30, ambos inclusive.'];
const BUDGET_MSG = '<div class="text-warning-emphasis text-opacity-75">Selecciona un producto y un plazo válidos para calcular el presupuesto.<br>Podrás agregar y eliminar productos, cambiar el plazo (te dará un descuento u otro dependiendo del número de días), así como seleccionar y deseleccionar extras.</div>';
let emptyFields = [];
let noValidatedFields = [];

// Función para validar el campo pasado por parámetro
function validateInput(submit, input, inputError, regEx1, regEx2, regEx3) {
    // Variables locales
    let testRegEx1, testRegEx2, testRegEx3;
    let errorMsg = '';

    // Formateo del texto introducido
    let format = input.value.replace(/\s+/g, ' ');
    if (input.type === 'tel' || input.type === 'email') {
        format.trim();
    }
    input.value = format;

    // Si se envía el formulario, el campo contiene texto o es un campo de tipo select, se comprueba su validación
    if (submit || input.value.length > 0 || input.tagName === 'SELECT') {
        // Al enviar el formulario, se comprueba si está vacío el campo que no sea tipo select
        if (submit && input.value.length === 0 && input.tagName !== 'SELECT') {
            errorMsg += '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Campo completado.</span>';
        }

        // Se testean los regEx que pueda tener el campo
        testRegEx1 = regEx1[0].test(format);
        if (regEx2 !== undefined) {
            testRegEx2 = regEx2[0].test(format);
        }
        if (regEx3 !== undefined) {
            testRegEx3 = regEx3[0].test(format);
        }

        // Si se valida el campo, se actualizan las clases y se devuelve true
        if (((!submit && testRegEx1) || (submit && ((testRegEx1 && input.tagName !== 'SELECT') || (testRegEx1 && input.tagName === 'SELECT' && cartItems.length > 0)))) && (regEx2 === undefined || (regEx2 !== undefined && testRegEx2)) && (regEx3 === undefined || (regEx3 !== undefined && testRegEx3))) {
            if (input.tagName !== 'SELECT') {
                input.classList.add('is-valid');
            }
            input.classList.remove('is-invalid');
            inputError.classList.remove('mt-1');
            inputError.innerHTML = '';
            return true;
        }

        // Si no se valida el campo, se crea un mensaje de error con los test definidos
        if ((!submit && testRegEx1) || (submit && ((testRegEx1 && input.tagName !== 'SELECT') || (testRegEx1 && input.tagName === 'SELECT' && cartItems.length > 0)))) {
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
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        inputError.classList.add('mt-1');
        inputError.innerHTML = errorMsg;
    } else {
        // Si no se envía el formulario, el campo está vacío y no es un campo de tipo select, se eliminan las clases y el mensaje de error
        input.classList.remove('is-valid', 'is-invalid');
        inputError.classList.remove('mt-1');
        inputError.innerHTML = '';
    }

    // Si no se valida el campo, se devuelve false
    return false;
}

// Función para validar el nombre
function validateName(submit) {
    if (!validateInput(submit, NAME_INPUT, NAME_ERROR, NAME_TEST_LENGTH, NAME_TEST_CHAR)) {
        if (NAME_INPUT.value.length === 0) {
            emptyFields.push(NAME_INPUT.placeholder);
        } else {
            noValidatedFields.push(NAME_INPUT.placeholder);
        }
    }
}

// Función para validar los apellidos
function validateSurnames(submit) {
    if (!validateInput(submit, SURNAMES_INPUT, SURNAMES_ERROR, SURNAMES_TEST_LENGTH, SURNAMES_TEST_CHAR_1, SURNAMES_TEST_CHAR_2)) {
        if (SURNAMES_INPUT.value.length === 0) {
            emptyFields.push(SURNAMES_INPUT.placeholder);
        } else {
            noValidatedFields.push(SURNAMES_INPUT.placeholder);
        }
    }
}

// Función para validar el teléfono
function validatePhoneNumber(submit) {
    if (!validateInput(submit, NUMBER_INPUT, NUMBER_ERROR, NUMBER_TEST_LENGH, NUMBER_TEST_CHAR_1, NUMBER_TEST_CHAR_2)) {
        if (NUMBER_INPUT.value.length === 0) {
            emptyFields.push(NUMBER_INPUT.placeholder);
        } else {
            noValidatedFields.push(NUMBER_INPUT.placeholder);
        }
    }
}

// Función para validar el email
function validateEmail(submit) {
    if (!validateInput(submit, EMAIL_INPUT, EMAIL_ERROR, EMAIL_TEST_LENGTH, EMAIL_TEST_CHAR)) {
        if (EMAIL_INPUT.value.length === 0) {
            emptyFields.push(EMAIL_INPUT.placeholder);
        } else {
            noValidatedFields.push(EMAIL_INPUT.placeholder);
        }
    }
}

// Función para validar el producto
function validateProduct(submit) {
    if (validateInput(submit, PRODUCT_SELECT, PRODUCT_ERROR, PRODUCT_TEST_CHAR)) {
        return true;
    }
    return false;
}

// Función para validar el plazo
function validateDeliveryTime(submit) {
    if (!validateInput(submit, DELIVERY_TIME_INPUT, DELIVERY_TIME_ERROR, DELIVERY_TIME_TEST_CHAR_1, DELIVERY_TIME_TEST_CHAR_2)) {
        if (DELIVERY_TIME_INPUT.value.length === 0) {
            emptyFields.push(DELIVERY_TIME_INPUT.placeholder);
        } else {
            noValidatedFields.push(DELIVERY_TIME_INPUT.placeholder);
        }
        return false;
    }
    return true;
}

// Función para resetear el formulario
function resetForm() {
    // Se resetean las variables
    emptyFields = [];
    noValidatedFields = [];

    // Se eliminan todas las clases
    NAME_INPUT.classList.remove('is-valid', 'is-invalid');
    NAME_ERROR.classList.remove('mt-1');
    SURNAMES_INPUT.classList.remove('is-valid', 'is-invalid');
    SURNAMES_ERROR.classList.remove('mt-1');
    NUMBER_INPUT.classList.remove('is-valid', 'is-invalid');
    NUMBER_ERROR.classList.remove('mt-1');
    EMAIL_INPUT.classList.remove('is-valid', 'is-invalid');
    EMAIL_ERROR.classList.remove('mt-1');
    PRODUCT_SELECT.classList.remove('is-valid', 'is-invalid');
    PRODUCT_ERROR.classList.remove('mt-1');
    DELIVERY_TIME_INPUT.classList.remove('is-valid', 'is-invalid');
    DELIVERY_TIME_ERROR.classList.remove('mt-1');
    CONDITIONS_INPUT.classList.remove('is-invalid');
    CONDITIONS_ERROR.classList.remove('mt-1');

    // Se eliminan los mensajes de error
    NAME_ERROR.innerHTML = '';
    SURNAMES_ERROR.innerHTML = '';
    NUMBER_ERROR.innerHTML = '';
    EMAIL_ERROR.innerHTML = '';
    PRODUCT_ERROR.innerHTML = '';
    DELIVERY_TIME_ERROR.innerHTML = '';
    CONDITIONS_ERROR.innerHTML = '';

    // Se resetean el presupuesto, el carrito y el formulario
    resetBudget();
    resetCart();
    FORM.reset();
}

// Función para enviar el formulario
function submitForm() {
    // Se resetean las variables
    emptyFields = [];
    noValidatedFields = [];

    // Se valida cada campo
    validateName(true);
    validateSurnames(true);
    validatePhoneNumber(true);
    validateEmail(true);
    validateProduct(true);
    validateDeliveryTime(true);

    // Si todo está validado, se envía el formulario
    if (noValidatedFields.length === 0 && cartItems.length > 0 && CONDITIONS_INPUT.checked) {
        /*
            Aquí se crearía un JSON y se enviaría al archivo correspondiente del servidor para que el formulario quede registrado donde corresponda
        */
        Swal.fire({
            topLayer: true,
            icon: 'success',
            title: '¡Formulario enviado correctamente!',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        resetForm();
    } else {
        // Si algún campo no está validado o no se ha seleccionado ningún producto, se genera el mensaje de error
        let errorMsg = '';

        // Función para el comienzo de los errores de campos vacíos y campos no validados
        function fieldsMsg(array) {
            if (array.length === 1) {
                errorMsg += '<p>El campo ';
            } else if (array.length > 1) {
                errorMsg += '<p>Los campos ';
            }
            array.forEach((field, index) => {
                errorMsg += `<i>${field}</i>`;
                if (index < array.length - 2) {
                    errorMsg += ', ';
                } else if (index < array.length - 1) {
                    errorMsg += ' y ';
                }
            });
        }

        // Se detectan los campos vacíos
        fieldsMsg(emptyFields);
        if (emptyFields.length === 1) {
            errorMsg += ' no está completado.</p>';
        } else if (emptyFields.length > 1) {
            errorMsg += ' no están completados.</p>';
        }

        // Se detectan los campos no validados
        if (emptyFields.length > 0 && noValidatedFields.length > 0) {
            errorMsg += ' ';
        }
        fieldsMsg(noValidatedFields);
        if (noValidatedFields.length === 1) {
            errorMsg += ' tiene un formato no válido.<p>';
        } else if (noValidatedFields.length > 1) {
            errorMsg += ' tienen formatos no válidos.</p>';
        }

        // Se detecta si se ha seleccionado algún producto
        if ((emptyFields.length > 0 || noValidatedFields.length > 0) && cartItems.length === 0) {
            errorMsg += ' ';
        }
        if (cartItems.length === 0) {
            errorMsg += '<p>No se ha seleccionado ningún producto.</p>';
        }

        // Se detecta si se han aceptado las condiciones
        if ((emptyFields.length > 0 || noValidatedFields.length > 0 || cartItems.length === 0) && !CONDITIONS_INPUT.checked) {
            errorMsg += ' ';
        }
        if (!CONDITIONS_INPUT.checked) {
            CONDITIONS_INPUT.classList.add('is-invalid');
            CONDITIONS_ERROR.classList.add('mt-1');
            CONDITIONS_ERROR.innerHTML = '<span class="text-danger"><i class="fa-solid fa-xmark me-2"></i>Condiciones de privacidad aceptadas.</span>';
            errorMsg += '<p>No se han aceptado las condiciones de privacidad.</p>';
        }

        // Se muestra el mensaje de error
        Swal.fire({
            topLayer: true,
            icon: 'info',
            title: '¡No es posible enviar el formulario!',
            html: errorMsg,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    }
}

// Función para ajustar las posiciones de header, nav y main
function adjustPadding() {
    const headerWidth = document.querySelector('body').getBoundingClientRect().width;
    const formActionsHeight = document.querySelector('#form-actions').getBoundingClientRect().height;
    const budgetCol = document.querySelector('#budget-col');

    if (headerWidth <= 767) {
        budgetCol.style.paddingBottom = formActionsHeight + 'px';
    } else {
        budgetCol.style.paddingBottom = '0';
    }
}

function addObserverPosition() {
    const observer = new ResizeObserver(() => {
        adjustPadding();
    });

    observer.observe(document.querySelector('body'));

    adjustPadding();
}

// Función para agregar eventos al formulario
function formEvents() {
    NAME_INPUT.addEventListener('input', () => {
        validateName(false);
    });
    SURNAMES_INPUT.addEventListener('input', () => {
        validateSurnames(false);
    });
    NUMBER_INPUT.addEventListener('input', () => {
        validatePhoneNumber(false);
    });
    EMAIL_INPUT.addEventListener('input', () => {
        validateEmail(false);
    });
    CONDITIONS_INPUT.addEventListener('click', () => {
        CONDITIONS_INPUT.classList.remove('is-invalid');
        CONDITIONS_ERROR.classList.remove('mt-1');
        CONDITIONS_ERROR.innerHTML = '';
    });
    BTN_RESET.addEventListener('click', () => {
        Swal.fire({
            topLayer: true,
            icon: 'question',
            title: '¿Seguro que quieres resetear?',
            text: 'Se resetearán todos los campos y se eliminará el presupuesto.',
            confirmButtonText: 'Resetear',
            confirmButtonColor: '#dc3741',
            showCancelButton: true,
            cancelButtonText: 'Volver',
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                resetForm();
            }
        });
    });
    BTN_SUBMIT.addEventListener('click', submitForm);
    addObserverPosition();
}

// Exportación de dependencias
export { formEvents, validateProduct, validateDeliveryTime };
