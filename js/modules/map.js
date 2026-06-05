'use strict';

// Variables generales
let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

// Elementos del DOM
let divRuta;

// Función para cargar los elementos del DOM
function cargarElementosDOMMapa() {
    divRuta = document.querySelectorAll('.leaflet-routing-container');
}

// Función para mostrar el mapa y la ruta si el usuario acepta compartir su ubicación
function success(position) {
    // Obtenemos las coordenadas del usuario
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // Creamos el mapa
    let map = L.map('map');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadimos la ruta al mapa
    L.Routing.control({
        waypoints: [L.latLng(latitude, longitude), L.latLng(40.03233455, -5.7437511)],
        language: 'es',
    }).addTo(map);

    // Evitamos la propagación de scroll y click en la ruta
    cargarElementosDOMMapa();
    evitarPropagacion();
}

// Función para mostrar el mapa si el usuario no acepta compartir su ubicación
function error() {
    // Establecemos los parámetros iniciales con la ubicación de la empresa
    let map = L.map('map', {
        center: [40.03233455, -5.7437511],
        zoom: 14,
    });

    // Creamos el mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadimos un marcador para la ubicación de la empresa
    L.marker([40.03233455, -5.7437511]).addTo(map);
}

// Función para evitar la propagación de scroll y click en la ruta
function evitarPropagacion() {
    divRuta.forEach((div) => {
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.disableClickPropagation(div);
    });
}

// Función "main" para la generación del mapa
export function generarMapa() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        alert('Los servicios de geolocalización no están disponibles.');
    }
}
