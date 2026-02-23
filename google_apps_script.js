/**
 * Google Apps Script para el Repositorio de Prácticas
 * 
 * Instrucciones:
 * 1. En tu Google Sheet, asegúrate de tener dos pestañas:
 *    - "Prácticas": Con columnas ID, Título, Descripción, Categoría, Archivo, Objetivo.
 *    - "feedback": Con columnas practicaId, name, course, rating, comment, timestamp.
 * 2. Ve a Extensiones > Apps Script.
 * 3. Pega este código y guarda.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 * 5. Tipo: Aplicación web. Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 */

function doGet(e) {
    const type = e.parameter.type;
    if (type === "practicas") {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Practicas");
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const rows = data.slice(1);

        const result = rows.map(row => {
            let obj = {};
            headers.forEach((header, i) => {
                obj[header.toLowerCase().trim()] = row[i];
            });
            return obj;
        });

        return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            data: result
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Feedback");

        // Columnas: practicaId, name, course, rating, comment, timestamp
        sheet.appendRow([
            params.practicaId,
            params.name,
            params.course,
            params.rating,
            params.comment,
            params.timestamp
        ]);

        return ContentService.createTextOutput(JSON.stringify({
            status: "success"
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            message: err.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}
