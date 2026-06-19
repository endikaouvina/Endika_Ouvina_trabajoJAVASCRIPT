'use strict';

// Elementos del DOM
const RUTA_DIV = document.querySelectorAll('.leaflet-routing-container');

// Variables globales
const COMPANY_LAT = 40.03233455;
const COMPANY_LNG = -5.7437511;
let options = {
    enableHighAccuracy: true,
    maximumAge: 0,
};
let map;
let companyMarker;

// Función para crear el mapa base con las coordenadas de la empresa
function initMap() {
    map = L.map('map', {
        center: [COMPANY_LAT, COMPANY_LNG],
        zoom: 14,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Se agrega un marcador para la ubicación de la empresa
    companyMarker = L.marker([COMPANY_LAT, COMPANY_LNG]).addTo(map);
}

// Función para evitar la propagación de scroll y click en la ruta
function preventPropagation() {
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

    // Se agrega la ruta al mapa
    L.Routing.control({
        waypoints: [L.latLng(latitude, longitude), L.latLng(COMPANY_LAT, COMPANY_LNG)],
        routeWhileDragging: true,
        language: 'es',
    }).addTo(map);

    // Se actualiza el centro y el zoom del mapa
    map.setView([(latitude + COMPANY_LAT) / 2, (longitude + COMPANY_LNG) / 2], 7);

    // Se elimina el marcador creado en initMap()
    if (companyMarker) {
        map.removeLayer(companyMarker);
    }

    // Se evita la propagación de scroll y click en el cuadro de la ruta
    preventPropagation();
}

// Función para mostrar el mensaje de error en consola
function error(err) {
    console.log('No ha sido posible obtener la geolocalización del usuario. Código: ' + err.code + '. Mensaje: ' + err.message + '.');
    Swal.fire({
        topLayer: true,
        icon: 'error',
        title: '¡Ha habido un error!',
        text: 'No ha sido posible obtener la geolocalización del usuario. No se añadirá la ruta al mapa.',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

// Función para crear el mapa y comprobar la geolocalización
function createMap() {
    initMap();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        Swal.fire({
            topLayer: true,
            icon: 'error',
            title: '¡Ha habido un error!',
            text: 'Los servicios de geolocalización no están disponibles. No se añadirá la ruta al mapa.',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    }
}

// Exportación de dependencias
export { createMap };
