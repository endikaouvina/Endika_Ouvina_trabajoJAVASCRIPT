'use strict';

// Dependencias de la aplicación
import { cargarJSON } from './modules/json.js';
import { cargarCarousel } from './modules/carousel.js';
import { crearMapa } from './modules/map.js';
import { eventosFormulario } from './modules/formValidation.js';
import { eventosPresupuesto } from './modules/presupuesto.js';

// Variables globales
const PAGE_URL = window.location.pathname;

// Inicialización específica para cada página
if (PAGE_URL === '/' || PAGE_URL.includes('index.html')) {
    cargarJSON();
} else if (PAGE_URL.includes('galeria.html')) {
    cargarCarousel();
} else if (PAGE_URL.includes('contacto.html')) {
    crearMapa();
} else if (PAGE_URL.includes('presupuesto.html')) {
    eventosFormulario();
    eventosPresupuesto();
}
