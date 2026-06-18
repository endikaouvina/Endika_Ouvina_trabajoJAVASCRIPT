'use strict';

// Elementos del DOM
const MAIN = document.querySelector('main');

// Variables globales
const URL_NOTICIAS = './resources/data/data.json';

// Función para crear el contenido del JSON
function createJSONContent(json) {
    json.forEach((elem) => {
        // Se crean los elementos
        const section = createElement('section');
        const container = createElement('div', ['container', 'card-container']);
        const h2 = createElement('h2');
        const row = createElement('div', ['row']);
        elem.cards.forEach((card) => {
            row.appendChild(createCard(card));
        });

        // Se agregan la información y los elementos al main
        h2.textContent = elem.title;
        container.appendChild(h2);
        container.appendChild(row);
        section.appendChild(container);
        MAIN.appendChild(section);
    });
}

// Función para crear una tarjeta
function createCard(card) {
    // Se crean y se agregan los elementos
    const divCard = createElement('div', ['col-lg', 'card', 'mx-3']);
    const divImg = createElement('div', ['h-100', 'd-flex', 'flex-column', 'justify-content-center']);
    const img = createElement('img', ['card-img'], { src: card.src, alt: card.alt });
    const cardBody = createElement('div', ['card-body']);
    const h3 = createElement('h3', ['card-title']);

    divImg.appendChild(img);
    cardBody.appendChild(h3);

    if (card.text !== '') {
        cardBody.appendChild(createCardBody(card.text, 'p', ['card-text']));
    }
    if (card.price !== '') {
        cardBody.appendChild(createCardBody(card.price, 'p', ['card-text']));
    }
    if (card.btnText !== '' && card.btnHref !== '') {
        cardBody.appendChild(createCardBody(card.btnText, 'a', ['btn', 'btn-secondary'], { href: card.btnHref }));
    }

    // Se agrega la información y los elementos a la tarjeta, que se devuelve
    h3.textContent = card.title;
    divCard.appendChild(divImg);
    divCard.appendChild(cardBody);

    return divCard;
}

// Función para crear el body de una tarjeta
function createCardBody(value, tag, classes, attr) {
    const elem = createElement(tag, classes, attr);
    elem.innerHTML = Number.isNaN(Number.parseFloat(value)) ? value : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number.parseFloat(value));

    return elem;
}

// Función para crear un elemento
function createElement(tag, classes, attr) {
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

// Función para cargar el JSON
async function cargarJSON(params) {
    try {
        const respuesta = await fetch(URL_NOTICIAS);
        if (!respuesta.ok) {
            throw new Error('Error HTTP:', respuesta.status);
        }
        const json = await respuesta.json();

        // Se crea y se agrega el contenido HTML
        createJSONContent(json);
    } catch (error) {
        console.error('Error al cargar el JSON:', error);
    }
}

// Exportación de dependencias
export { cargarJSON };
