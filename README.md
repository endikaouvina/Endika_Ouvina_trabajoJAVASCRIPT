# Endika Ouviña - Trabajo JavaScript

## Indicaciones para el/la profesor/a que me corrija el trabajo

Además de lo solicitado en el enunciado, he implementado aspectos adicionales con el objetivo de hacerlo lo más profesional posible. Me gustaría que se me evaluara con los criterios establecidos, pero me gustaría pedir si es posible que también se me diera un feedback de los siguientes puntos, con el fin de aprender y mejorar de cara a futuros trabajos/proyectos del curso y de cara a un trabajo en una empresa:

1. He creado una estructura de directorios y separación de código en archivos más pequeños. **¿La estructura es correcta? ¿Se podría cambiar algo para mejorarlo?**
2. Me he animado a crear el archivo `/robots.txt`, donde he añadido una regla para que los robots no indexen la ruta `/resources/fonts-originals/`, ya que no se utiliza en el proyecto, pero sí incluyo la ruta como prevención si algún día necesitase utilizar los archivos originales de las fuentes. Respecto a este archivo, me surge la siguiente duda:
    - Cuando un robot tiene que indexar un archivo o ruta, se hace sobre el archivo `/index.html` o sobre la ruta `/pages/`. El resto de rutas no se indexan directamente, sino que son archivos que utilizan los archivos y rutas que sí se indexa. **¿También debería añadir reglas en el archivo `/robots.txt` para que no indexe rutas como `/assets/`, `/css/`, `/js/` o `/resources/`?**
3. La página de inicio carga todo el contenido desde el archivo `/resources/data/data.json` y crea los elementos a través del archivo `/js/modules/json.js`, lo que quiere decir que, si hay problemas al acceder al JSON, en la página de inicio solo se vería el `header`, el `nav` y el `footer`. **¿Qué se podría hacer al respecto?**
    - Se me ocurre que la estructura HTML ya podría estar en el DOM desde el comienzo y cargar el contenido desde el JSON, pero si hay problemas, en la página de inicio se verían huecos vacíos.
4. Partiendo del carrusel que se enseña en [esta clase](https://www.youtube.com/watch?v=ZWq_3VS1xLE), he creado una clase `Carousel` para poder reutilizar en futuros proyectos con solo copiar los archivos `/css/components/carousel.css` y `/js/modules/carousel.js` y crear una instancia de la clase, pasando como parámetro un objeto literal con las opciones descritas más abajo. **¿Cómo podría mejorarlo?**
    - Por un lado, haciendo caso a lo aprendido al comienzo del curso, sé que 517 líneas de código en un único archivo, es mucho, pero la manera que se me ocurre de separarlo en varios archivos es medias clases hijas que hereden de la clase `Carousel`, ya que todo el archivo contiene solo la clase (con sus parámetros y métodos). Pero eso significa hacer instancias de las clases hijas, cosa que no veo lógica ya que es un solo carrusel.
    - Por otro lado, tengo entendido que en librerías profesionales, la lógica se separa en diferentes archivos, de manera que cada archivo se encargue de una sola cosa (por ejemplo, un archivo se encarga de los controles; otro, de los puntos; etc.). Aunque no sé cómo llevarlo a cabo.
    - En un futuro me gustaría implementar funcionalidades para hacer una librería más profesional y reutilizable en cualquier proyecto: _autoplay_, arrastre, compatibilidad de arrastre para dispositivos con pantalla táctil, _lightbox_, personalización de controles, habilitar el teclado para avanzar o retroceder el carrusel, añadir información a cada slide (si es un producto, por ejemplo, que se vea el título, una descripción y el precio), y funcionalidades que me vayan ocurriendo, por lo que me gustaría saber también **cuál podría ser la mejor estructura** para escalar la librería en un futuro.
    - Además de las funcionalidades, añadiría también una función específica (creo que sería mejor fuera de la clase, pero en la propia librería), capaz de crear _modals_ similares a los que hay actualmente en la web (plugin [`SweetAlert2`](https://sweetalert2.github.io/)).
    - Me gustaría subir la librería correspondiente al carrusel como una librería que cualquier persona pueda descargarse y utilizar en cualquier proyecto, para lo que añadiría un README.md con la explicación de las opciones descritas más abajo, y explicaciones adicionales que puedan ser útiles.
5. En la validación del formulario, tengo en cuenta que el campo `name` puede tener nombres compuestos y que las letras de los campos `name` y `surnames` pueden estar en cualquier idioma. **¿Debería hacer lo mismo con los campos `number` y `email`, a pesar de que, entiendo, los caracteres son universales?**
6. La validación del formulario y la lógica para calcular y mostrar el presupuesto lo desarrollo en archivos diferentes: `/js/modules/formValidation.js` y `/js/modules/budget.js` respectivamente. Sin embargo, hay exportaciones e importaciones de funciones entre ambos archivos (en ambas direcciones). **¿Es una buena práctica hacerlo así?**
    - Lo he hecho así para separar la validación del formulario en un único archivo con el fin de poder reutilizarlo en futuros proyectos.
7. A la hora de cargar la página `contacto`, se carga el mapa únicamente con la ubicación de la empresa. Luego, si el usuario acepta compartir la ubicación, se añade la ruta. Aunque normalmente se ejecuta correctamente, hay veces que tarda un poquito más y ha habido alguna vez que me daba la sensación de que algo fallaba porque no se cargaba la ruta. **¿Es posible que haya desarrollado mal esa parte? ¿Cómo se podría mejorar?**
8. Haciendo caso a lo aprendido al comienzo del curso, todos los mensajes se muestran al usuario mediante el uso del plugin [`SweetAlert2`](https://sweetalert2.github.io/), expecto en los siguientes dos casos:
    - En el archivo `/js/modules/json.js` se utiliza un `console.error()` para mostrar por consola el error interno al intentar cargar el JSON.
    - En el archivo `/js/modules/map.js` se utiliza un `console.error()` para mostrar por consola el código y el mensaje del error interno al intentar obtener la geolocalización del usuario.
      **A pesar de ser errores internos, ¿debería quitar los `console.error()` y mostrar dichos errores a través del _modal_ correspondiente?**

## Enlaces

- **[Enlace del repositorio de GitHub](https://github.com/endikaouvina/Endika_Ouvina_trabajoJAVASCRIPT.git)**
- **[Enlace del hosting en GitHub Pages](https://endikaouvina.github.io/Endika_Ouvina_trabajoJAVASCRIPT/)**

## Opciones del slider

### Opciones obligatorias

- `container`: el elemento donde se quiere insertar toda la estructura del carrusel. Valores posibles: `elemento HTML`, `id`, `clase`.
- `images`: `array` con el listado de imágenes en formato `objeto`. Cada imagen (`objeto`) tiene que tener obligatoriamente la clave `src`, siendo opcional la clave `alt`.

### Opciones adicionales

- `loop`: Si llega al último slide al avanzar hacia la derecha o al primero al avanzar hacia la izquierda, se muestra el siguiente slide pudiendo seguir el avance. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `maxDots`: El número máximo de puntos a mostrar cuando la opción `showDots` es igual a `true`. El valor tiene que ser un número entero mayor o igual que `1`. Valor por defecto: `7`.
- `showControls`: Muestra la flecha anterior y la siguiente. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `showDots`: Muestra puntos debajo del slider, identificando con estilos diferentes el punto correspondiente al _slide_ (imagen) activo y los puntos de los extremos en caso de que haya más imágenes en su dirección. Valores posibles: `true`, `false`. Valor por defecto: `true`.
- `slidesToShow`: Número de _slides_ (imágenes) visibles. Valores posibles: `1`, `3`. Valor por defecto: `3`.
- `startIndex`: El _slide_ (imagen) que se muestra por defecto en la posición central. El valor debe ser un número entero mayor o igual que `0` y menor que el total de imágenes añadidas en la opción `images`. Valor por defecto: `0`.
- `transitionDuration`: Duración (en milisegundos) para la animación al agregar y eliminar _slides_ (imágenes) y puntos. Debe ser un número entero mayor o igual que `0`. Valor por defecto: `200`.
