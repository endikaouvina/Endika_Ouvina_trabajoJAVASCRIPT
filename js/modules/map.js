'use strict';

let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

// Función para mostrar el mapa y la ruta si el usuario acepta compartir su ubicación
function success(position) {
    // Obtenemos las coordenadas del usuario
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // Creamos el mapa
    let map = L.map('map');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadimos la ruta al mapa
    L.Routing.control({
        waypoints: [L.latLng(latitude, longitude), L.latLng(40.03233455, -5.7437511)],
        language: 'es',
    }).addTo(map);
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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadimos un marcador para la ubicación de la empresa
    L.marker([40.03233455, -5.7437511]).addTo(map);
}

// Función "main" para la generación del mapa
export function generarMapa() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        alert('Los servicios de geolocalización no están disponibles.');
    }
}
