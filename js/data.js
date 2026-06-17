// =====================================
// UTILIDADES
// =====================================

function convertirLinkDriveAImagen(url) {
  if (!url) return "";

  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (!match) return "";

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
}

// =====================================
// CONFIGURACIÓN GOOGLE SHEETS
// =====================================

const SHEET_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSugZplAvcSBZjGPZikP3jhTaKA6DtMwZpOZc0_ophORRVGjemhu3Z5JEY3EnsZMUayuhviSia3Gf58/pub?";

// =====================================
// BIOFÁBRICAS
// gid = 0
// =====================================

const SHEET_CSV_BIOFABRICAS =
  `${SHEET_BASE}gid=0&single=true&output=csv`;

async function fetchBiofabricas() {

  const response = await fetch(SHEET_CSV_BIOFABRICAS);

  const csv = await response.text();

  const rows = csv.trim().split("\n");

  return rows.slice(1).map(row => {

    const values = row.split(",");

    return {
      id: values[0],
      name: values[1],
      lat: parseFloat(values[2]),
      lng: parseFloat(values[3]),
      region: values[4],
      estado: values[5],
      descripcion: values[6],
      imagen: convertirLinkDriveAImagen(values[7]),
      tags: values[8]
        ? values[8].split(";")
        : []
    };
  });
}

// =====================================
// KPI
// gid = 1232917699
// =====================================

const SHEET_CSV_KPI =
  `${SHEET_BASE}gid=1232917699&single=true&output=csv`;

async function fetchKPIs() {

  const response = await fetch(SHEET_CSV_KPI);

  const csv = await response.text();

  const rows = csv.trim().split("\n");

  return rows.slice(1).map(row => {

    const values = row.split(",");

    return {
      nombre: values[0]?.trim(),
      valor: values[1]?.trim()
    };
  });
}

// =====================================
// RECURSOS
// gid = 1587744224
// =====================================

const SHEET_CSV_RECURSOS =
  `${SHEET_BASE}gid=1587744224&single=true&output=csv`;

async function fetchRecursos() {

  const response = await fetch(SHEET_CSV_RECURSOS);

  const csv = await response.text();

  const rows = csv.trim().split("\n");

  return rows.slice(1).map(row => {

    const values = row.split(",");

    return {

      nombre: values[0]?.trim(),

      tipo: values[1]?.trim(),

      categoria: values[2]?.trim(),

      enlace: values[3]?.trim()

    };
  });
}