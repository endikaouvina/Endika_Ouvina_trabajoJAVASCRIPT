'use strict';

// Función para ajustar las posiciones de header, nav y main
function adjustPosition() {
    const windowHeight = window.innerHeight;
    const headerHeight = document.querySelector('body > header').getBoundingClientRect().height;
    const navHeight = document.querySelector('body > nav:first-of-type').getBoundingClientRect().height;
    const nav = document.querySelector('body > nav:first-of-type');
    const navButton = nav.querySelector('div[type="button"]');
    const navDropdownMenu = nav.querySelector('.dropdown-menu');
    const main = document.querySelector('body > main:first-of-type');

    if (windowHeight <= 800) {
        nav.style.top = (headerHeight - navHeight) / 2 + 'px';
        main.style.paddingTop = headerHeight + 'px';
    } else {
        nav.style.top = headerHeight + 'px';
        main.style.paddingTop = headerHeight + navHeight + 'px';
        navButton.classList.remove('show');
        navButton.ariaExpanded = false;
        navDropdownMenu.classList.remove('show');
    }
}

function addEventObserver() {
    const observer = new ResizeObserver(() => {
        adjustPosition();
    });

    observer.observe(document.querySelector('body > header'));
    observer.observe(document.querySelector('body > nav:first-of-type'));

    window.addEventListener('resize', adjustPosition);

    adjustPosition();
}

// Exportación de dependencias
export { addEventObserver };
