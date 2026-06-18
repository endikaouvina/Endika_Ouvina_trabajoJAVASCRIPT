# Endika Ouviña - Trabajo JavaScript

## Indicaciones para el/la profesor/a que me corrija el trabajo

## Direcciones del trabajo

**Dirección del respositorio de GitHub:** [https://github.com/endikaouvina/Endika_Ouvina_trabajoJAVASCRIPT.git](https://github.com/endikaouvina/Endika_Ouvina_trabajoJAVASCRIPT.git)
**Dirección del hosting en GitHub Pages:** [https://endikaouvina.github.io/Endika_Ouvina_trabajoJAVASCRIPT/](https://endikaouvina.github.io/Endika_Ouvina_trabajoJAVASCRIPT/)

## Opciones del slider

### Opciones obligatorias

- `container`: el elemento donde se quiere insertar toda la estructura del carrusel. Valores posibles: `elemento HTML`, `id`, `clase`.
- `images`: `array` con el listado de imágenes en formato `objeto`. Cada imagen (`objeto`) tiene que tener obligatoriamente la clave `src`, siendo opcional la clave `alt`.

### Opciones opcionales

- `loop`: Si llega al último slide al avanzar hacia la derecha o al primero al avanzar hacia la izquierda, se muestra el siguiente slide pudiendo seguir el avance. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `maxDots`: El número máximo de puntos a mostrar cuando la opción `showDots` es igual a `true`. El valor tiene que ser un número entero mayor o igual que `1`. Valor por defecto: `7`. Si el valor es mayor al total de imágenes añadidas en la opción `images`, se actualizará con el total de imágenes añadidas en la opción `images`.
- `showControls`: Muestra la flecha anterior y la siguiente. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `showDots`: Muestra puntos debajo del slider, identificando con estilos diferentes el punto correspondiente al _slide_ (imagen) activo y los puntos de los extremos en caso de que haya más imágenes en su dirección. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `slidesToShow`: Número de _slides_ (imágenes) visibles. Valores posibles: `1`, `3`. Valor por defecto: `3`. Si el total de imágenes añadidas en la opción `images` es menor que 3, el valor se actualizará a `1` automáticamente.
- `startIndex`: El _slide_ (imagen) que se muestra por defecto en la posición central. El valor debe ser un número entero mayor o igual que `0` y menor que el total de imágenes añadidas en la opción `images`. Valor por defecto: `0`.
- `transitionDuration`: Duración (en milisegundos) para la animación al agregar y eliminar _slides_ (imágenes) y puntos. Debe ser un número entero mayor o igual que `0`. Valor por defecto: `200`.
