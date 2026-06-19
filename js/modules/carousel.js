'use strict';

// Clase para crear una instancia del carrusel
class Carousel {
    // Opciones por defecto
    static defaultOptions = {
        loop: true,
        maxDots: 7,
        showControls: true,
        showDots: true,
        slidesToShow: 3,
        startIndex: 0,
        transitionDuration: 200,
    };

    state = {
        currentIndex: 0,
        isAnimating: false,
    };

    errorMsg = [];

    /* CONSTRUCTOR Y FUNCIÓN DE INICIO (tras validación) */

    constructor(options) {
        if (!options) {
            this.errorMsg.push('<p>No se ha especificado ninguna opción. Las opciones <i>container</i> e <i>images</i> son obligatorias.</p>');
        } else if (Object.getPrototypeOf(options) !== Object.prototype) {
            this.errorMsg.push('<p>Las opciones tienen que estar en formato de objeto literal.</p>');
        } else {
            // Se valida la información introducida por el usuario
            this.validateContainer(options);
            this.validateImages(options);
            this.validateOptions(options);
        }

        // Se inicializa el carrusel
        if (this.errorMsg.length === 0) {
            this.options = {
                ...Carousel.defaultOptions,
                ...options,
            };
            this.init();
        } else {
            this.showErrors();
        }
    }
    init() {
        this.state.currentIndex = this.options.startIndex;
        this.container = document.querySelector(this.options.container);
        this.createDOM();
        this.cacheDOM();
        this.bindEvents();
        this.render();
    }

    /* FUNCIONES DE VALIDACIÓN */

    // Función para validar la opción 'container' de la instancia
    validateContainer(options) {
        if (options === undefined || !Object.hasOwn(options, 'container')) {
            this.errorMsg.push('<p>La opción <i>container</i> es obligatoria.</p>');
            return;
        }
        try {
            this.container = document.querySelector(options.container);
        } catch {
            this.errorMsg.push(`<p><i>${options.container}</i> no es un selector válido.</p>`);
            return;
        }
        if (!this.container) {
            let attr = '';
            if (options.container.startsWith('#')) {
                attr = 'con id ';
            } else if (options.container.startsWith('.')) {
                attr = 'con clase ';
            }
            this.errorMsg.push(`<p>No existe el elemento ${attr}<i>` + (attr !== '' ? options.container.substr(1) : options.container) + '</i> en el DOM.</p>');
        }
    }
    // Función para validar la opción 'images' de la instancia
    validateImages(options) {
        if (options === undefined || !Object.hasOwn(options, 'images')) {
            this.errorMsg.push('<p>La opción <i>images</i> es obligatoria.</p>');
            return;
        }
        if (!Array.isArray(options.images)) {
            this.errorMsg.push('<p>La opción <i>images</i> debe ser un array.</p>');
            return;
        }
        if (options.images.length === 0) {
            this.errorMsg.push('<p>La opción <i>images</i> debe contener, al menos, una imagen.</p>');
            return;
        }
        options.images.forEach((image, index) => {
            if (Object.getPrototypeOf(image) !== Object.prototype) {
                this.errorMsg.push(`<p>La imagen <strong>${index}</strong> debe ser un objeto literal.</p>`);
            } else if (!Object.hasOwn(image, 'src')) {
                this.errorMsg.push(`<p>La imagen <strong>${index}</strong> no tiene <i>src</i>.</p>`);
            } else if (typeof image.src !== 'string') {
                this.errorMsg.push(`<p>La clave <i>src</i> de la imagen <strong>${index}</strong> tiene que ser de tipo string (cadena).</p>`);
            } else if (image.src === '') {
                this.errorMsg.push(`<p>La clave <i>src</i> de la imagen <strong>${index}</strong> no debe estar vacía.</p>`);
            }
        });
    }
    // Función para validar todas las opciones excepto 'container' e 'images'
    validateOptions(options) {
        for (const [key, value] of Object.entries(options)) {
            switch (key) {
                case 'loop':
                case 'showControls':
                case 'showDots':
                    this.validateValue(options, key, value, 'boolean');
                    break;
                case 'maxDots':
                    this.validateValue(options, key, value, 'number', 1);
                    break;
                case 'slidesToShow':
                    this.validateValue(options, key, value, 'number');
                    break;
                case 'startIndex':
                case 'transitionDuration':
                    this.validateValue(options, key, value, 'number', 0);
                    break;
                default:
                    if (key !== 'container' && key !== 'images') {
                        this.errorMsg.push(`<p>No se reconoce la opción <i>${key}</i>.</p>`);
                    }
                    break;
            }
        }
    }
    // Función para validar el valor de todas las opciones excepto 'container' e 'images'
    validateValue(options, key, value, type, min) {
        if (typeof value !== type) {
            this.errorMsg.push(`<p>La opción <i>${key}</i> debe ser de tipo <i>${type}</i>.</p>`);
            return;
        }
        if (key === 'slidesToShow') {
            this.validateSlidesToShow(options, key, value);
        } else if (type === 'number') {
            this.validateNumber(options, key, value, min);
        }
    }
    // Función para validar los valores de tipo number
    validateNumber(options, key, value, min) {
        if (!Number.isInteger(value) || value < min || (key !== 'transitionDuration' && value > options.images.length - 1)) {
            let msg = `<p>La opción <i>${key}</i> debe ser`;
            if (!Number.isInteger(value)) {
                msg += ' un número entero';
            }
            if (value < min) {
                msg += ` mayor o igual que ${min}`;
            }
            if (key !== 'transitionDuration') {
                if (value < min && value > options.images.length - 1) {
                    msg += ' y';
                }
                if (value > options.images.length - 1) {
                    msg += ' menor que el total de imágenes añadidas en la opción "images"';
                }
            }
            msg += '.</p>';
            this.errorMsg.push(msg);
        }
    }
    // Función para validar el valor de la opción slidesToShow
    validateSlidesToShow(options, key, value) {
        if (options.images.length < 3 && value !== 1) {
            this.errorMsg.push(`<p>Al haber menos de 3 imágenes, la opción <i>${key}</i> solo puede tener el valor 1.</p>`);
        } else if (options.images.length >= 3 && value !== 1 && value !== 3) {
            this.errorMsg.push(`<p>La opción <i>${key}</i> solo puede tener los valores 1 y 3.</p>`);
        }
    }

    /* FUNCIONES PARA CREAR LA ESTRUCTURA DEL CARRUSEL Y DIFERENTES ELEMENTOS */

    createDOM() {
        // Se establecen atributos al container
        this.container.role = 'region';
        this.container.ariaLabel = 'Carrusel';

        // Se crean los controles y el slider
        let divSliderClasses = ['crl__slider'];
        let ctrlPrev, ctrlNext;
        if (this.options.showControls) {
            if (!(!this.options.loop && this.options.startIndex === 0)) {
                ctrlPrev = this.createControl('crl__control--prev', 'Anterior', 'fa-angle-left');
            }
            if (!(!this.options.loop && this.options.startIndex === this.options.images.length)) {
                ctrlNext = this.createControl('crl__control--next', 'Siguiente', 'fa-angle-right');
            }
        } else {
            divSliderClasses.push('crl__slider--fluid');
        }
        const divSlider = this.createElement('div', divSliderClasses);

        // Se crean y se agregan los slides
        for (let i = 1; i <= this.options.slidesToShow; i++) {
            let slideClasses = ['crl__slide'];
            let slide;
            if (this.options.slidesToShow === 3 && (i === 1 || i === 3)) {
                slideClasses.push('crl__slide--inactive');
            } else {
                slideClasses.push('crl__slide--active');
            }
            if (!this.options.loop && this.options.slidesToShow === 3 && ((i === 1 && this.state.currentIndex === 0) || (i === 3 && this.state.currentIndex === this.options.images.length - 1))) {
                slide = this.createElement('div', slideClasses);
            } else {
                slide = this.createSlide(slideClasses);
            }
            slide.style.setProperty('--crl__transition-duration', `${this.options.transitionDuration}ms`);
            divSlider.appendChild(slide);
        }

        // Se crea y se agrega el inner al container
        const divInner = this.createElement('div', ['crl__inner']);
        [ctrlPrev, divSlider, ctrlNext].forEach((elem) => {
            if (elem) {
                divInner.appendChild(elem);
            }
        });
        this.container.appendChild(divInner);

        // Se crean y se agregan los puntos al container
        if (this.options.showDots) {
            const navDots = this.createElement('nav', ['crl__dots'], { 'aria-label': 'Navegación del carrusel' });
            for (let i = 0; i < this.options.maxDots; i++) {
                const dot = this.createElement('div', ['crl__dot']);
                dot.style.setProperty('--crl__transition-duration', `${this.options.transitionDuration}ms`);
                navDots.appendChild(dot);
            }
            this.container.appendChild(navDots);
        }
    }
    createControl(ctrlClass, ctrlAriaLabel, iconClass) {
        const ctrl = this.createElement('button', ['crl__control', ctrlClass], { 'aria-label': ctrlAriaLabel });
        ctrl.appendChild(this.createElement('i', ['fa-solid', iconClass, 'fa-lg']));
        return ctrl;
    }
    createSlide(slideClasses) {
        const slide = this.createElement('div', slideClasses);
        slide.appendChild(this.createElement('img', [], { draggable: 'false', loading: 'lazy' }));
        return slide;
    }
    createElement(tag, classes, attr) {
        const elem = document.createElement(tag);

        if (classes !== undefined && classes.length) {
            elem.classList.add(...classes);
        }

        if (attr !== undefined) {
            for (const [key, value] of Object.entries(attr)) {
                elem.setAttribute(key, value);
            }
        }

        return elem;
    }

    /* FUNCIONES PARA ASIGNAR ELEMENTOS COMO ATRIBUTOS DE LA CLASE */

    cacheDOM() {
        this.inner = this.container.querySelector('.crl__inner');
        this.slider = this.container.querySelector('.crl__slider');
        this.cacheSlides();
        if (this.options.showControls) {
            this.cacheControls();
        }
        if (this.options.showDots) {
            this.navDots = this.container.querySelector('.crl__dots');
        }
    }
    cacheControls() {
        this.ctrlPrev = this.container.querySelector('.crl__control--prev');
        this.ctrlNext = this.container.querySelector('.crl__control--next');
    }
    cacheSlides() {
        this.slideActive = this.container.querySelector('.crl__slide--active');
        this.slideActiveImg = this.container.querySelector('.crl__slide--active img');
        if (this.options.slidesToShow === 3) {
            this.slidePrev = this.container.querySelector('.crl__slide--inactive:first-of-type');
            this.slidePrevImg = this.container.querySelector('.crl__slide--inactive:first-of-type img');
            this.slideNext = this.container.querySelector('.crl__slide--inactive:last-of-type');
            this.slideNextImg = this.container.querySelector('.crl__slide--inactive:last-of-type img');
        }
    }

    /* FUNCIONES PARA AGREGAR EVENTOS */

    bindEvents() {
        if (this.options.showControls) {
            this.bindCtrlEvents(true, true);
        }
    }
    bindCtrlEvents(ctrlPrev, ctrlNext) {
        if (this.ctrlPrev && ctrlPrev) {
            this.ctrlPrev.addEventListener('click', () => this.prev());
        }
        if (this.ctrlNext && ctrlNext) {
            this.ctrlNext.addEventListener('click', () => this.next());
        }
    }

    /* FUNCIONES PARA OBTENER LOS INDEX */

    getSlideIndex(offset) {
        return (this.state.currentIndex + offset + this.options.images.length) % this.options.images.length;
    }
    getDotIndex(dotIndex) {
        const lengthImages = this.options.images.length;
        const maxDots = this.options.maxDots;
        if (this.options.loop) {
            return this.getSlideIndex(dotIndex - Math.floor(maxDots / 2));
        } else {
            if (lengthImages <= maxDots) {
                return dotIndex;
            }
            let startIndex = Math.min(Math.max(this.state.currentIndex - Math.floor(maxDots / 2), 0), lengthImages - maxDots);
            return startIndex + dotIndex;
        }
    }

    /* FUNCIONES PARA RENDERIZAR DIFERENTES ELEMENTOS */

    render() {
        this.renderSlides();
        if (this.options.showDots) {
            this.updateDots(0);
        }
    }
    renderSlides() {
        this.renderImg(this.slideActiveImg, this.state.currentIndex);
        if (this.options.slidesToShow === 3) {
            if (!(!this.options.loop && this.state.currentIndex === 0)) {
                this.renderImg(this.slidePrevImg, this.getSlideIndex(-1));
            }
            if (!(!this.options.loop && this.state.currentIndex === this.options.images.length - 1)) {
                this.renderImg(this.slideNextImg, this.getSlideIndex(1));
            }
        }
    }
    renderImg(img, index) {
        img.src = this.options.images[index].src;
        if (this.options.images[index].alt) {
            img.alt = this.options.images[index].alt;
        }
    }
    renderDots(direction) {
        if (this.options.images.length > this.options.maxDots && (this.options.loop || (!this.options.loop && this.state.currentIndex > Math.floor(this.options.maxDots / 2) - (direction === 'next' ? 0 : 1) && this.state.currentIndex < this.options.images.length - this.options.maxDots / 2 - (direction === 'prev' && this.options.maxDots / 2 !== Math.floor(this.options.maxDots / 2) ? 1 : 0) + (direction === 'next' && this.options.maxDots / 2 === Math.floor(this.options.maxDots / 2) ? 1 : 0)))) {
            const newDot = this.createElement('div', ['crl__dot', 'crl__dot--edge', 'crl__dot--hidden']);
            newDot.style.setProperty('--crl__transition-duration', `${this.options.transitionDuration}ms`);
            let dotToHide;
            if (direction === 'next') {
                dotToHide = this.navDots.childNodes[0];
                this.navDots.appendChild(newDot);
            } else {
                dotToHide = this.navDots.childNodes[this.options.maxDots - 1];
                this.navDots.prepend(newDot);
            }
            newDot.offsetWidth;
            this.updateDots(direction === 'next' ? -1 : 0);
            requestAnimationFrame(() => {
                dotToHide.classList.add('crl__dot--hidden');
                newDot.classList.remove('crl__dot--hidden');
            });
            dotToHide.addEventListener(
                'transitionend',
                () => {
                    dotToHide.remove();
                },
                {
                    once: true,
                },
            );
        } else {
            this.updateDots(0);
        }
    }

    /* FUNCIONES PARA BLOQUEAR/DESBLOQUEAR CUANDO HAY UNA ANIMACIÓN */

    lockAnimation() {
        this.state.isAnimating = true;
    }
    unlockAnimation() {
        this.state.isAnimating = false;
    }

    /* FUNCIONES PARA AVANZAR A LA ANTERIOR O SIGUIENTE IMAGEN */

    prev() {
        this.goTo(this.getSlideIndex(-1), 'prev');
    }
    next() {
        this.goTo(this.getSlideIndex(1), 'next');
    }
    goTo(targetIndex, direction) {
        if (this.state.isAnimating || targetIndex === this.state.currentIndex) {
            return;
        }

        this.lockAnimation();

        this.updateSlides(targetIndex, direction);
        if (this.options.showDots) {
            this.renderDots(direction);
        }

        if (this.options.showControls && !this.options.loop) {
            setTimeout(() => {
                this.updateControls();
            }, this.options.transitionDuration / 2);
        }
    }

    /* FUNCIONES PARA ACTUALIZAR DIFERENTES ELEMENTOS AL AVANZAR A OTRA IMAGEN */

    updateSlides(targetIndex, direction) {
        let newSlide;
        if (!this.options.loop && ((direction === 'next' && this.state.currentIndex === this.options.images.length - (this.options.slidesToShow === 3 ? 2 : 1)) || (direction === 'prev' && this.state.currentIndex === (this.options.slidesToShow === 3 ? 1 : 0)))) {
            newSlide = this.createElement('div', ['crl__slide', 'crl__slide--inactive', 'crl__slide--hidden']);
        } else {
            newSlide = this.createSlide(['crl__slide', 'crl__slide--inactive', 'crl__slide--hidden']);
            this.renderImg(newSlide.querySelector('img'), this.getSlideIndex((this.options.slidesToShow === 3 ? 2 : 1) * (direction === 'next' ? 1 : -1)));
        }
        newSlide.style.setProperty('--crl__transition-duration', `${this.options.transitionDuration}ms`);
        this.state.currentIndex = targetIndex;
        if (direction === 'next') {
            this.slider.appendChild(newSlide);
            this.howSlidesToAnimate(this.slidePrev, this.slideActive, this.slideNext, newSlide);
        } else {
            this.slider.prepend(newSlide);
            this.howSlidesToAnimate(this.slideNext, this.slideActive, this.slidePrev, newSlide);
        }
    }
    howSlidesToAnimate(slide1, slide2, slide3, slide4) {
        if (this.options.slidesToShow === 3) {
            this.animationSlides(slide1, slide2, slide3, slide4);
        } else {
            this.animationSlides(slide2, slide2, slide4, slide4);
        }
    }
    animationSlides(slideToHide, slideToInactive, slideToActive, slideToShow) {
        void slideToShow.offsetWidth;
        requestAnimationFrame(() => {
            slideToHide.classList.add('crl__slide--hidden');
            slideToInactive.classList.replace('crl__slide--active', 'crl__slide--inactive');
            slideToActive.classList.replace('crl__slide--inactive', 'crl__slide--active');
            slideToShow.classList.remove('crl__slide--hidden');
        });
        slideToHide.addEventListener(
            'transitionend',
            () => {
                slideToHide.remove();
                this.cacheSlides();
                this.unlockAnimation();
            },
            { once: true },
        );
    }
    updateControls() {
        if (this.ctrlPrev && this.state.currentIndex === 0) {
            this.ctrlPrev.remove();
            this.cacheControls();
        } else if (!this.ctrlPrev && this.state.currentIndex > 0) {
            this.inner.prepend(this.createControl('crl__control--prev', 'Anterior', 'fa-angle-left'));
            this.cacheControls();
            this.bindCtrlEvents(true, false);
        }
        if (this.ctrlNext && this.state.currentIndex === this.options.images.length - 1) {
            this.ctrlNext.remove();
            this.cacheControls();
        } else if (!this.ctrlNext && this.state.currentIndex < this.options.images.length - 1) {
            this.inner.appendChild(this.createControl('crl__control--next', 'Siguiente', 'fa-angle-right'));
            this.cacheControls();
            this.bindCtrlEvents(false, true);
        }
    }
    updateDots(offset) {
        this.navDots.childNodes.forEach((dot, index) => {
            if (this.getDotIndex(index + offset) === this.state.currentIndex) {
                dot.classList.add('crl__dot--active');
            } else {
                dot.classList.remove('crl__dot--active');
            }
            if ((this.options.loop && this.options.images.length > this.options.maxDots && (index + offset === 0 || index + offset === this.options.maxDots - 1)) || (!this.options.loop && ((index + offset === 0 && this.getDotIndex(index + offset) > 0) || (index + offset === this.options.maxDots - 1 && this.getDotIndex(index + offset) < this.options.images.length - 1)))) {
                dot.classList.add('crl__dot--edge');
            } else {
                dot.classList.remove('crl__dot--edge');
            }
        });
    }

    /* FUNCIÓN PARA MOSTRAR ERRORES */

    showErrors() {
        let msgHTML = '';
        this.errorMsg.forEach((msg) => {
            msgHTML += msg;
        });
        Swal.fire({
            topLayer: true,
            icon: 'info',
            title: '¡No es posible cargar el carrusel!',
            html: msgHTML,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    }
}

// Exportación de dependencias
export { Carousel };
