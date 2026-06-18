'use strict';

// Función para ajustar las posiciones de header, nav y main
function adjustPosition() {
    const headerHeight = document.querySelector('body > header').getBoundingClientRect().height;
    const headerNav = document.querySelector('body > nav:first-of-type').getBoundingClientRect().height;

    document.querySelector('body > nav:first-of-type').style.top = headerHeight + 'px';
    document.querySelector('body > main:first-of-type').style.paddingTop = headerHeight + headerNav + 'px';
}

function addObserverPosition() {
    const observer = new ResizeObserver(() => {
        adjustPosition();
    });

    observer.observe(document.querySelector('body > header'));
    observer.observe(document.querySelector('body > nav:first-of-type'));

    adjustPosition();
}

// Exportación de dependencias
export { addObserverPosition };
