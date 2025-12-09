// este archivo contiene utilidades para exportar rutinas en formatos CSV y para imprimir.
// Proporciona una función para descargar una rutina en formato CSV.
// Proporciona una función para abrir una vista de impresión de una rutina.
// Utiliza técnicas de escape y sanitización para asegurar la correcta generación de los archivos.
// Facilita a los usuarios la exportación y visualización imprimible de sus rutinas.

import { Rutina } from "@/types/rutina";

const CSV_SEPARATOR = ";";

const sanitizeCsv = (value: string) => {
  const needsQuotes = value.includes(CSV_SEPARATOR) || value.includes("\n") || value.includes("\"");
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "rutina";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function downloadRutinaCsv(rutina: Rutina) {
  const lines: string[] = [];
  lines.push(["Nombre", "Descripción"].join(CSV_SEPARATOR));
  lines.push([
    sanitizeCsv(rutina.nombre),
    sanitizeCsv(rutina.descripcion ?? "Sin descripción"),
  ].join(CSV_SEPARATOR));
  lines.push("");
  lines.push("Ejercicios");
  lines.push(["Nombre", "Día", "Series", "Repeticiones", "Peso", "Notas"].join(CSV_SEPARATOR));
  rutina.ejercicios.forEach((ejercicio) => {
    lines.push(
      [
        sanitizeCsv(ejercicio.nombre),
        sanitizeCsv(ejercicio.dia_semana),
        String(ejercicio.series),
        String(ejercicio.repeticiones),
        sanitizeCsv(ejercicio.peso != null ? `${ejercicio.peso} kg` : "-"),
        sanitizeCsv(ejercicio.notas ?? "Sin notas"),
      ].join(CSV_SEPARATOR),
    );
  });

  const csvContent = lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${slugify(rutina.nombre)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openRutinaPrintView(rutina: Rutina): boolean {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    return false;
  }

  const ejerciciosRows = rutina.ejercicios
    .map(
      (ejercicio) => `
        <tr>
          <td>${escapeHtml(ejercicio.nombre)}</td>
          <td>${escapeHtml(ejercicio.dia_semana)}</td>
          <td>${ejercicio.series}</td>
          <td>${ejercicio.repeticiones}</td>
          <td>${ejercicio.peso != null ? escapeHtml(`${ejercicio.peso} kg`) : "-"}</td>
          <td>${escapeHtml(ejercicio.notas ?? "Sin notas")}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Rutina - ${escapeHtml(rutina.nombre)}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            color: #111;
            margin: 0;
            padding: 0;
          }
          .container {
            padding: 16px 24px 32px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .descripcion {
            margin-bottom: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #999;
            padding: 6px 8px;
            text-align: left;
          }
          th {
            background: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${escapeHtml(rutina.nombre)}</h1>
          <p class="descripcion">${escapeHtml(rutina.descripcion ?? "Sin descripción")}</p>
          <h2>Ejercicios</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Día</th>
                <th>Series</th>
                <th>Repeticiones</th>
                <th>Peso</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              ${ejerciciosRows || "<tr><td colspan=\"6\">Sin ejercicios</td></tr>"}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  return true;
}
