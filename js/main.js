'use strict';

import { prepararPresupuesto } from './modules/presupuesto.js';

$(document).ready(function () {
    let urlPagina = window.location.href;
    if (urlPagina.includes('presupuesto.html')) {
        prepararPresupuesto();
    }
});
