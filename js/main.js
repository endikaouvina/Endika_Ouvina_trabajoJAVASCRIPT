'use strict';

import { cargarNoticias } from './modules/json.js';
import { iniciarCarousel } from './modules/carousel.js';
import { generarMapa } from './modules/map.js';
import { prepararFormulario } from './modules/formValidation.js';
import { prepararPresupuesto } from './modules/presupuesto.js';

let urlPagina = window.location.href;
if (urlPagina.includes('galeria.html')) {
    iniciarCarousel();
} else if (urlPagina.includes('contacto.html')) {
    generarMapa();
} else if (urlPagina.includes('presupuesto.html')) {
    prepararFormulario();
    prepararPresupuesto();
} else {
    cargarNoticias();
}
