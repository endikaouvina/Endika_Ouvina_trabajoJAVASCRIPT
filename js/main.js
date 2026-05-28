'use strict';

import { prepararFormulario } from './modules/formValidation.js';
import { prepararPresupuesto } from './modules/presupuesto.js';

$(document).ready(function () {
    let urlPagina = window.location.href;
    if (urlPagina.includes('presupuesto.html')) {
        prepararFormulario();
        prepararPresupuesto();
    }
});
