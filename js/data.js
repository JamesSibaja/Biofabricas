// ============================
// CONFIG
// ============================

const SHEET_ID =
"2PACX-1vSugZplAvcSBZjGPZikP3jhTaKA6DtMwZpOZc0_ophORRVGjemhu3Z5JEY3EnsZMUayuhviSia3Gf58";

// ============================
// BIOFABRICAS
// ============================

const BIOFABRICAS_URL =
`https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=0&single=true&output=csv`;

async function fetchBiofabricas() {
    const response = await fetch(BIOFABRICAS_URL);
    const csv = await response.text();

    const rows = csv.trim().split("\n");

    return rows.slice(1).map(row => {

        const v = row.split(",");

        return {

            id:v[0],
            name:v[1],
            lat:parseFloat(v[2]),
            lng:parseFloat(v[3]),
            region:v[4],
            estado:v[5],
            descripcion:v[6],
            imagen:v[7],
            tags:v[8]?.split(";") || []
        };
    });
}