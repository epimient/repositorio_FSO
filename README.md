# Repositorio de Prácticas: Fundamentos de Sistemas Operativos

Un proyecto de **Ing. Eduardo Pimienta León**

---

## 📝 Descripción

Este sitio web es un repositorio dinámico para las prácticas de la materia de **Fundamentos de Sistemas Operativos**. La plataforma permite a los estudiantes:
- Visualizar el contenido de las prácticas desde un visualizador integrado.
- Filtrar por categorías como **Linux** o **Windows**.
- Buscar prácticas por título o descripción.
- Calificar y dejar comentarios (feedback) sobre cada laboratorio.

La arquitectura del sitio está diseñada para ser 100% administrable desde la nube sin necesidad de editar código fuente para añadir contenido nuevo.

## 🚀 Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3 contemporáneo, JavaScript (ES6+).
*   **Diseño:** Bootstrap 5 con una interfaz profesional y limpia.
*   **Iconografía:** Bootstrap Icons.
*   **Backend & CMS:** Google Apps Script (actuando como API).
*   **Persistencia de Datos:** Google Sheets (almacena tanto la lista de prácticas como las opiniones de los estudiantes).
*   **Contenido de Prácticas:** Google Docs (publicados para la web).

## 🛠️ Cómo Administrar el Repositorio

El sitio se alimenta de una hoja de cálculo de Google. Para realizar cambios, debes tener acceso al Google Sheet configurado en el `script.js`.

### 1. Añadir una Nueva Práctica

Para que una nueva práctica aparezca en el sitio, simplemente añade una nueva fila en la pestaña de **Prácticas** del Google Sheet con las siguientes columnas:

| Columna | Descripción |
| :--- | :--- |
| **ID** | Un número único identificador (ej: 1, 2, 3...). |
| **Título** | Nombre de la práctica. |
| **Descripción** | Resumen breve de lo que se aprenderá. |
| **Categoría** | Debe ser `linux` o `windows` (en minúsculas). |
| **Archivo** | El enlace del Google Doc (ver sección abajo). |
| **Objetivo** | El objetivo principal de aprendizaje. |

### 2. Preparar el Google Doc de la Práctica

Para que el documento sea visible dentro del sitio:
1.  Abre el Google Doc.
2.  Ve a `Archivo > Compartir > Publicar en la web`.
3.  Selecciona la pestaña `Enlace` y haz clic en **Publicar**.
4.  Copia la URL generada y pégala en la columna **Archivo** de tu Google Sheet.

### 3. Sistema de Comentarios

Las opiniones dejadas por los estudiantes en la web se guardan automáticamente en una pestaña llamada **Opiniones** (o similar) en tu Google Sheet. Esto permite un seguimiento fácil del feedback de la comunidad.

---
© 2026 - Docente: Ing. Eduardo Pimienta Leon - Corporación Universidad Americana
