'use strict';

import { prepararFormulario } from './modules/formValidation.js';
import { prepararPresupuesto } from './modules/presupuesto.js';
import { generarMapa } from './modules/map.js';
import { iniciarCarousel } from './modules/carousel.js';

$(document).ready(function () {
    let urlPagina = window.location.href;
    if (urlPagina.includes('galeria.html')) {
        iniciarCarousel();
    }
    if (urlPagina.includes('contacto.html')) {
        generarMapa();
    }
    if (urlPagina.includes('presupuesto.html')) {
        prepararFormulario();
        prepararPresupuesto();
    }
});
