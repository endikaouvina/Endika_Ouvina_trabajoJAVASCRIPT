'use strict';

// Dependencias de la aplicación
import { cargarJSON } from './modules/json.js';
import { Carousel } from './modules/carousel.js';
import { crearMapa } from './modules/map.js';
import { eventosFormulario } from './modules/formValidation.js';
import { eventosPresupuesto } from './modules/presupuesto.js';

// Variables globales
const PAGE_URL = window.location.pathname;

// Inicialización específica para cada página
if (PAGE_URL === '/' || PAGE_URL.includes('index.html') || PAGE_URL === '/Endika_Ouvina_trabajoJAVASCRIPT/') {
    cargarJSON();
} else if (PAGE_URL.includes('galeria.html')) {
    new Carousel({
        container: '#crl',
        images: [
            { src: '../assets/img/altavoz_bluetooth.jpg', alt: 'Altavoz Bluetooth' },
            { src: '../assets/img/altavoz_karaoke.jpg', alt: 'Altavoz Karaoke' },
            { src: '../assets/img/bolso_para_movil.jpg', alt: 'Bolso para móvil' },
            { src: '../assets/img/cable_de_carga.jpg', alt: 'Cable de carga' },
            { src: '../assets/img/cargador_de_pared.jpg', alt: 'Cargador de pared' },
            { src: '../assets/img/funda_para_pasaporte.jpg', alt: 'Funda para pasaporte' },
            { src: '../assets/img/gimbal_multifuncion.jpg', alt: 'Gimbal multifunción' },
            { src: '../assets/img/identificador_de_maletas.jpg', alt: 'Identificador de maletas' },
            { src: '../assets/img/imanes_para_coche.jpg', alt: 'Imanes para coche' },
            { src: '../assets/img/pulverizador.jpg', alt: 'Pulverizador' },
            { src: '../assets/img/smart_band.jpg', alt: 'Smart Band' },
            { src: '../assets/img/smartwatch.jpg', alt: 'Smartwatch' },
            { src: '../assets/img/soporte_lampara_led.jpg', alt: 'Soporte lámpara LED' },
            { src: '../assets/img/soporte_para_mesa.jpg', alt: 'Soporte para mesa' },
            { src: '../assets/img/tarjetero_soporte.jpg', alt: 'Tarjetero soporte' },
        ],
        loop: true,
        maxDots: 7,
        showControls: true,
        showDots: true,
        slidesToShow: 3,
        startIndex: 0,
        transitionDuration: 200,
    });
} else if (PAGE_URL.includes('contacto.html')) {
    crearMapa();
} else if (PAGE_URL.includes('presupuesto.html')) {
    eventosFormulario();
    eventosPresupuesto();
}
