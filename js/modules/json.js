'use strict';

// Variables globales
const URL_NOTICIAS = '../resources/data/noticias.json';

// Elementos del DOM
let main;

// Función para cargar los elementos del DOM
function cargarElementosDOMJSON() {
    main = document.querySelector('main');
}

// Función para crear las cartas
function createJSONCard(item) {
    // Creamos los elementos necesarios
    const card = document.createElement('div');
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    const body = document.createElement('div');
    const title = document.createElement('h3');
    const text = document.createElement('p');
    const button = document.createElement('a');

    // Agregamos los atributos necesarios
    img.src = item.src;
    img.alt = item.alt;
    button.href = item.href;

    // Agregamos las clases necesarias
    card.classList.add('col', 'card', 'mx-3');
    imgDiv.classList.add('h-100', 'd-flex', 'flex-column', 'justify-content-center');
    img.classList.add('card-img');
    body.classList.add('card-body');
    title.classList.add('card-title');
    text.classList.add('card-text');
    button.classList.add('btn', 'btn-secondary');

    // Agregamos el contenido
    title.textContent = item.title;
    text.textContent = item.text;
    button.textContent = item.buttonText;

    // Construimos la estructura de la tarjeta
    imgDiv.appendChild(img);
    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(button);
    card.appendChild(imgDiv);
    card.appendChild(body);

    // Devolvemos la tarjeta
    return card;
}

// Función para crear el contenido
function createJSONContent(json) {
    // Creamos los elementos necesarios
    const section = document.createElement('section');
    const container = document.createElement('div');
    const title = document.createElement('h2');
    const row = document.createElement('div');

    // Agregamos las clases necesarias
    container.classList.add('container');
    row.classList.add('row');

    // Agregamos el contenido
    title.textContent = 'DESCUBRE NUESTRO CONTENIDO';

    // Construimos la estructura del contenido
    json.forEach((item) => {
        row.appendChild(createJSONCard(item));
    });
    container.appendChild(title);
    container.appendChild(row);
    section.appendChild(container);

    // Devolvemos el contenido
    return section;
}

// Función para cargar el JSON
async function cargarNoticias(params) {
    try {
        const respuesta = await fetch(URL_NOTICIAS);
        if (!respuesta.ok) {
            throw new Error('Error HTTP:', respuesta.status);
        }
        const json = await respuesta.json();

        // Cargamos el contenido del JSON, creamos el contenido HTML y lo insertamos en la página
        cargarElementosDOMJSON();
        let content = createJSONContent(json);
        main.insertBefore(content, main.children[0]);
    } catch (error) {
        console.error('Error al cargar el JSON:', error);
    }
}

// Declaramos las exportaciones necesarias
export { cargarNoticias };
