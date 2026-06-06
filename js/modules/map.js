'use strict';

// Elementos del DOM
const RUTA_DIV = document.querySelectorAll('.leaflet-routing-container');

// Variables globales
let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

// Función para evitar la propagación de scroll y click en la ruta
function evitarPropagacion() {
    RUTA_DIV.forEach((div) => {
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.disableClickPropagation(div);
    });
}

// Función para mostrar el mapa y la ruta si el usuario acepta compartir su ubicación
function success(position) {
    // Se obtienen las coordenadas del usuario
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // Se crea el mapa
    let map = L.map('map');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Se agrega la ruta al mapa
    L.Routing.control({
        waypoints: [L.latLng(latitude, longitude), L.latLng(40.03233455, -5.7437511)],
        language: 'es',
    }).addTo(map);

    // Se evita la propagación de scroll y click en la ruta
    evitarPropagacion();
}

// Función para mostrar el mapa si el usuario no acepta compartir su ubicación
function error() {
    // Se establecen los parámetros iniciales con la ubicación de la empresa
    let map = L.map('map', {
        center: [40.03233455, -5.7437511],
        zoom: 14,
    });

    // Se crea el mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Se agrega un marcador para la ubicación de la empresa
    L.marker([40.03233455, -5.7437511]).addTo(map);
}

// Función para comprobar la geolocalización y crear el mapa
function crearMapa() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        alert('Los servicios de geolocalización no están disponibles.');
    }
}

// Exportación de dependencias
export { crearMapa };
