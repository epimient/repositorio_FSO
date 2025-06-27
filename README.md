# Repositorio de Prácticas: Fundamentos de Sistemas Operativos

Un proyecto de **Ing. Eduardo Pimienta León**

---

## Descripción

Este sitio web sirve como un repositorio centralizado para las prácticas de la materia de Fundamentos de Sistemas Operativos. La plataforma está diseñada para ser dinámica y fácil de mantener, permitiendo a los estudiantes visualizar el contenido de las prácticas, filtrarlas por categorías (Linux, Windows) y dejar calificaciones y comentarios.

El contenido de cada práctica se gestiona directamente desde Google Docs, lo que permite que cualquier modificación en un documento se refleje automáticamente en el sitio web sin necesidad de volver a desplegarlo. Las calificaciones y comentarios se almacenan en tiempo real utilizando Firebase.

## Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Framework CSS:** Bootstrap 5
*   **Iconos:** Bootstrap Icons
*   **CMS (Contenido):** Google Docs (`Archivo > Publicar en la web`)
*   **Base de Datos (Feedback):** Firebase Realtime Database

## Cómo Añadir una Nueva Práctica Manualmente

Para añadir una nueva práctica al repositorio, sigue estos dos sencillos pasos.

### Paso 1: Publicar el Google Doc

Primero, necesitas hacer que tu documento de Google sea públicamente accesible en formato web.

1.  Abre el Google Doc que contiene tu nueva práctica.
2.  Ve al menú superior y haz clic en `Archivo` -> `Compartir` -> `Publicar en la web`.
3.  En la ventana que aparece, asegúrate de que esté seleccionada la pestaña `Enlace`.
4.  Haz clic en el botón azul que dice **Publicar** y acepta la confirmación.
5.  Copia el enlace que se genera. Este es el enlace que usaremos.

![Guía para publicar en la web](https://i.imgur.com/5aP2pBC.png)

### Paso 2: Añadir la Práctica al Fichero `script.js`

A continuación, debes informar al sitio web sobre esta nueva práctica añadiéndola a la lista principal.

1.  Abre el archivo `script.js` en un editor de texto.
2.  Localiza el array (la lista) llamado `todasLasPracticas` al principio del archivo.
3.  Añade un nuevo objeto JavaScript al final de la lista. **Recuerda añadir una coma (`,`) después del último elemento existente** antes de añadir el nuevo.

Usa la siguiente plantilla para tu nueva práctica:

```javascript
{
    id: 'practicaX', // IMPORTANTE: Usa un nuevo número (ej: 'practica5', 'practica6')
    titulo: 'Título de la Nueva Práctica',
    descripcion: 'Una descripción breve de lo que trata la práctica.',
    archivo: 'URL_DE_GOOGLE_DOCS?embedded=true', // Pega aquí el enlace del Paso 1 y añade ?embedded=true al final
    categoria: 'linux' // o 'windows', según corresponda
},
```

**Ejemplo práctico:**

Si el array `todasLasPracticas` se ve así:

```javascript
const todasLasPracticas = [
    // ... otras prácticas aquí ...
    {
        id: 'practica4', /* ... */ categoria: 'linux'
    }
];
```

Lo modificarías para que se vea así (añadiendo la `practica5`):

```javascript
const todasLasPracticas = [
    // ... otras prácticas aquí ...
    {
        id: 'practica4', /* ... */ categoria: 'linux'
    }, // <-- ¡No olvides esta coma!
    {
        id: 'practica5',
        titulo: 'Nueva Práctica sobre Redes',
        descripcion: 'Configuración de redes en sistemas Linux y Windows.',
        archivo: 'https://docs.google.com/document/d/e/2PACX-1v.../pub?embedded=true',
        categoria: 'linux'
    } // <-- El último elemento de la lista no lleva coma
];
```

4.  Guarda el archivo `script.js`.

¡Eso es todo! Si tienes el proyecto en tu computadora, la nueva práctica aparecerá al recargar la página. Si lo has subido a GitHub Pages, solo necesitas subir el archivo `script.js` actualizado para que los cambios se reflejen en línea.
