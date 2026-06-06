'use strict';

// Elementos del DOM
const CAROUSEL = document.querySelector('#crl');

// Variables globales
const IMGS_CAROUSEL = [
    { src: '../assets/img/altavoz_bluetooth.jpg', alt: 'Altavoz Bluetooth' },
    { src: '../assets/img/altavoz_karaoke.jpg', alt: 'Altavoz Karaoke' },
    { src: '../assets/img/auriculares_alpha.jpg', alt: 'Auricular Alpha' },
    { src: '../assets/img/auriculares_expert.jpg', alt: 'Auricular Expert' },
    { src: '../assets/img/auriculares_urban.jpg', alt: 'Auricular Urban' },
    { src: '../assets/img/bolso_para_movil.jpg', alt: 'Bolso para móvil' },
    { src: '../assets/img/cable_de_carga.jpg', alt: 'Cable de carga' },
    { src: '../assets/img/cargador_de_pared.jpg', alt: 'Cargador de pared' },
    { src: '../assets/img/colgante_bolas.jpg', alt: 'Colgante de bolas' },
    { src: '../assets/img/colgante_etnico.jpg', alt: 'Colgante etnico' },
    { src: '../assets/img/colgante_tubular.jpg', alt: 'Colgante tubular' },
    { src: '../assets/img/funda_para_pasaporte.jpg', alt: 'Funda para pasaporte' },
    { src: '../assets/img/gimbal_multifuncion.jpg', alt: 'Gimbal multifunción' },
    { src: '../assets/img/identificador_de_maletas.jpg', alt: 'Identificador de maletas' },
    { src: '../assets/img/imanes_para_coche.jpg', alt: 'Imanes para coche' },
    { src: '../assets/img/power_bank_5000.jpg', alt: 'Power Bank 5000 mAh' },
    { src: '../assets/img/power_bank_10000.jpg', alt: 'Power Bank 10000 mAh' },
    { src: '../assets/img/power_bank_5000_3en1.jpg', alt: 'Power Bank 5000 mAh 3 en 1' },
    { src: '../assets/img/pulverizador.jpg', alt: 'Pulverizador' },
    { src: '../assets/img/smart_band.jpg', alt: 'Smart Band' },
    { src: '../assets/img/smartwatch.jpg', alt: 'Smartwatch' },
    { src: '../assets/img/soporte_lampara_led.jpg', alt: 'Soporte lámpara LED' },
    { src: '../assets/img/soporte_para_mesa.jpg', alt: 'Soporte para mesa' },
    { src: '../assets/img/tarjetero_soporte.jpg', alt: 'Tarjetero soporte' },
];
let currentIndex = 0;
let isDragging = false;
let startX = 0;

// Función para actualizar el carrusel
function updateCarousel() {
    // Variables locales y elementos del DOM
    const prevIndex = (currentIndex - 1 + IMGS_CAROUSEL.length) % IMGS_CAROUSEL.length;
    const nextIndex = (currentIndex + 1) % IMGS_CAROUSEL.length;

    const imgPrev = document.querySelector('.crl__slide--prev img');
    const imgCurrent = document.querySelector('.crl__slide--active img');
    const imgNext = document.querySelector('.crl__slide--next img');
    const dots = document.querySelectorAll('.crl__dot');

    // Se actualizan los atributos de las imágenes
    imgPrev.src = IMGS_CAROUSEL[prevIndex].src;
    imgPrev.alt = IMGS_CAROUSEL[prevIndex].alt;
    imgCurrent.src = IMGS_CAROUSEL[currentIndex].src;
    imgCurrent.alt = IMGS_CAROUSEL[currentIndex].alt;
    imgNext.src = IMGS_CAROUSEL[nextIndex].src;
    imgNext.alt = IMGS_CAROUSEL[nextIndex].alt;

    // Se actualizan los puntos
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('crl__dot--active');
        } else {
            dot.classList.remove('crl__dot--active');
        }
        if (IMGS_CAROUSEL.length > 7 && ((currentIndex <= 3 && index === 6) || (currentIndex >= 4 && currentIndex <= IMGS_CAROUSEL.length - 4 && (index === currentIndex - 3 || index === currentIndex + 3)) || (currentIndex >= IMGS_CAROUSEL.length - 3 && index === IMGS_CAROUSEL.length - 7))) {
            dot.classList.add('crl__dot--edge');
        } else {
            dot.classList.remove('crl__dot--edge');
        }
        if ((currentIndex <= 3 && index >= 7) || (currentIndex >= 4 && currentIndex <= IMGS_CAROUSEL.length - 4 && (index < currentIndex - 3 || index > currentIndex + 3)) || (currentIndex >= IMGS_CAROUSEL.length - 3 && index < IMGS_CAROUSEL.length - 7)) {
            dot.classList.add('crl__dot--hidden');
        } else {
            dot.classList.remove('crl__dot--hidden');
        }
    });
}

// Función para agregar la funcionalidad de arrastre al carrusel
function agregarArrastre(element) {
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        element.classList.add('crl__slide--dragging');
    });

    element.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const endX = e.pageX - startX;
            if (endX > 100) {
                currentIndex = (currentIndex - 1 + IMGS_CAROUSEL.length) % IMGS_CAROUSEL.length;
                isDragging = false;
                updateCarousel();
            } else if (endX < -100) {
                currentIndex = (currentIndex + 1) % IMGS_CAROUSEL.length;
                isDragging = false;
                updateCarousel();
            }
        }
    });

    element.addEventListener('mouseup', () => {
        isDragging = false;
        element.classList.remove('crl__slide--dragging');
    });
}

// Función para construir la estructura del carrusel
function cargarCarousel() {
    // Se crean los elementos necesarios
    const crlInner = document.createElement('div');
    const crlSlider = document.createElement('div');
    const crlImgPrev = document.createElement('div');
    const crlImgCurrent = document.createElement('div');
    const crlImgNext = document.createElement('div');
    const btnPrev = document.createElement('button');
    const btnNext = document.createElement('button');
    const btnPrevIcon = document.createElement('i');
    const btnNextIcon = document.createElement('i');
    const dotsContainer = document.createElement('div');

    // Se agregan las clases necesarias
    crlInner.classList.add('crl__inner');
    crlSlider.classList.add('crl__slider');
    crlImgPrev.classList.add('crl__slide', 'crl__slide--prev');
    crlImgCurrent.classList.add('crl__slide', 'crl__slide--active');
    crlImgNext.classList.add('crl__slide', 'crl__slide--next');
    btnPrev.classList.add('crl__control', 'crl__control--prev');
    btnNext.classList.add('crl__control', 'crl__control--next');
    btnPrevIcon.classList.add('fa-solid', 'fa-angle-left', 'fa-lg');
    btnNextIcon.classList.add('fa-solid', 'fa-angle-right', 'fa-lg');
    dotsContainer.classList.add('crl__dots');

    // Se construye la estructura del carrusel
    btnPrev.appendChild(btnPrevIcon);
    btnNext.appendChild(btnNextIcon);
    crlSlider.appendChild(crlImgPrev);
    crlSlider.appendChild(crlImgCurrent);
    crlSlider.appendChild(crlImgNext);
    crlInner.appendChild(btnPrev);
    crlInner.appendChild(crlSlider);
    crlInner.appendChild(btnNext);
    CAROUSEL.appendChild(crlInner);
    CAROUSEL.appendChild(dotsContainer);

    // Se agregan las imágenes a los divs correspondientes
    [crlImgPrev, crlImgCurrent, crlImgNext].forEach((crlImg, index) => {
        const img = document.createElement('img');
        img.draggable = false;
        crlImg.appendChild(img);
    });

    // Se agrega un punto y su evento, por cada una de las imágenes
    IMGS_CAROUSEL.forEach((img, index) => {
        const dot = document.createElement('div');
        dot.classList.add('crl__dot');
        dotsContainer.appendChild(dot);

        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Se agregan los eventos a los botones
    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + IMGS_CAROUSEL.length) % IMGS_CAROUSEL.length;
        updateCarousel();
    });
    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % IMGS_CAROUSEL.length;
        updateCarousel();
    });

    // Se agrega la funcionalidad de arrastre
    agregarArrastre(crlImgPrev);
    agregarArrastre(crlImgCurrent);
    agregarArrastre(crlImgNext);

    // Se inicializa el carrusel
    updateCarousel();
}

// Eportación de dependencias
export { cargarCarousel };
