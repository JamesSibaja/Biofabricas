// =============================
// CONFIGURACIÓN DEL MAPA
// =============================
const bounds = L.latLngBounds(
  [8.0, -86.5],   // suroeste
  [11.5, -82.0]   // noreste
);

const map = L.map("map", {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  minZoom: 7,
  maxZoom: 18,
  zoomControl: true
}).setView([9.93, -84.08], 8);

const markers = [];

// =============================
// CAPA BASE
// =============================
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// =============================
// PANEL LATERAL
// =============================
const panel = document.getElementById("infoPanel");

// =============================
// RENDER PANEL
// =============================
function renderPanel(bio) {
  panel.innerHTML = `
    <img 
      src="${bio.imagen || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800'}"
      alt="${bio.name}"
      onerror="this.src='https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800'"
    />

    <div class="card-content">
      <div class="card-header">
        <h3>${bio.name}</h3>
        <span class="status">${bio.estado}</span>
      </div>

      <p class="location">${bio.region}, Costa Rica</p>

      <p class="description">
        ${bio.descripcion}
      </p>

      <div class="tags">
        ${bio.tags
          .map(tag => `<span>${tag}</span>`)
          .join("")}
      </div>

      <div class="card-actions">
        <button>Documentos</button>
        <button>Videos</button>
        <button>Ficha técnica</button>
      </div>
    </div>
  `;
}

// =============================
// ICONO PERSONALIZADO
// =============================
const greenIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// =============================
// DATOS Google Sheets
// =============================
async function initMapData() {
  const biofabricas = await fetchBiofabricas();

  biofabricas.forEach((bio) => {
    const marker = L.marker([bio.lat, bio.lng], {
      icon: greenIcon
    }).addTo(map);

    marker.bindPopup(`
      <div class="map-popup">
        <div class="popup-header">
          <h4>${bio.name}</h4>
          <span class="popup-status">${bio.estado}</span>
        </div>
    
        <p class="popup-region">📍 ${bio.region}, Costa Rica</p>
    
        <p class="popup-desc">
          ${bio.descripcion}
        </p>
    
        <div class="popup-tags">
          ${bio.tags
            .slice(0, 2)
            .map(tag => `<span>${tag}</span>`)
            .join("")}
        </div>
    
        <div class="popup-cta">
          Haz clic para ver ficha →
        </div>
      </div>
    `);

    marker.on("click", () => {
      renderPanel(bio);

      map.flyTo(
        [bio.lat, bio.lng],
        10,
        { duration: 1 }
      );
    });

    markers.push({ marker, bio });
  });
}


// =============================
// BÚSQUEDA
// =============================
const searchInput = document.getElementById("searchBox");
const provinciaFilter = document.getElementById("provinciaFilter");
const estadoFilter = document.getElementById("estadoFilter");
const tipoFilter = document.getElementById("tipoFilter");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

function searchBiofabrica() {
  const query = searchInput.value.toLowerCase().trim();
  const provincia = provinciaFilter.value;
  const estado = estadoFilter.value;
  const tipo = tipoFilter.value;

  const resultados = markers.filter(item => {
    const bio = item.bio;

    const matchTexto =
      query === "" ||
      bio.name.toLowerCase().includes(query) ||
      bio.region.toLowerCase().includes(query);

    const matchProvincia =
      provincia === "Todas las provincias" ||
      bio.region === provincia;

    const matchEstado =
      estado === "Todos los estados" ||
      bio.estado === estado;

    const matchTipo =
      tipo === "Todos los tipos" ||
      bio.tags.some(tag =>
        tag.toLowerCase().includes(tipo.toLowerCase())
      );

    return (
      matchTexto &&
      matchProvincia &&
      matchEstado &&
      matchTipo
    );
  });

  if (resultados.length > 0) {
    const primerResultado = resultados[0];

    map.flyTo(
      [primerResultado.bio.lat, primerResultado.bio.lng],
      10,
      { duration: 1 }
    );

    primerResultado.marker.openPopup();
    renderPanel(primerResultado.bio);
  } else {
    alert("No se encontraron resultados.");
  }
}

searchBtn.addEventListener("click", searchBiofabrica);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBiofabrica();
  }
});

// =============================
// RESET
// =============================
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  provinciaFilter.selectedIndex = 0;
  estadoFilter.selectedIndex = 0;
  tipoFilter.selectedIndex = 0;

  map.flyTo([9.93, -84.08], 8, {
    duration: 1
  });

  panel.innerHTML = `
    <div class="card-content">
      <h3>Selecciona una biofábrica</h3>
      <p>Haz clic en un marcador para ver la ficha.</p>
    </div>
  `;
});

provinciaFilter.addEventListener("change", searchBiofabrica);
estadoFilter.addEventListener("change", searchBiofabrica);
tipoFilter.addEventListener("change", searchBiofabrica);

// =============================
// PANEL INICIAL
// =============================
resetBtn.click();

async function renderKPIs() {
  const heroStats = document.getElementById("heroStats");

  const kpis = await fetchKPIs();

  heroStats.innerHTML = kpis.map(kpi => `
    <div class="stat">
      <strong>${kpi.valor}</strong>
      <span>${kpi.nombre}</span>
    </div>
  `).join("");
}

// =============================
// RECURSOS
// =============================
function getYoutubeEmbed(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

function renderVideoCard(recurso) {
  const embed = getYoutubeEmbed(recurso.enlace);

  return `
    <div class="resource-card">
      <iframe
        src="${embed}"
        title="${recurso.nombre}"
        allowfullscreen
      ></iframe>

      <div class="resource-content">
        <h3>${recurso.nombre}</h3>
        <p>Video / Webinar</p>
        <a href="${recurso.enlace}" target="_blank">
          Ver video
        </a>
      </div>
    </div>
  `;
}

function renderPDFCard(recurso) {
  return `
    <div class="resource-card">
      <iframe
        src="${recurso.enlace}"
        title="${recurso.nombre}"
      ></iframe>

      <div class="resource-content">
        <h3>${recurso.nombre}</h3>
        <p>Documento PDF</p>
        <a href="${recurso.enlace}" target="_blank">
          Abrir documento
        </a>
      </div>
    </div>
  `;
}

function renderGenericCard(recurso) {
  return `
    <div class="resource-card">
      <div class="resource-placeholder">
        📁
      </div>

      <div class="resource-content">
        <h3>${recurso.nombre}</h3>
        <p>${recurso.tipo}</p>
        <a href="${recurso.enlace}" target="_blank">
          Abrir recurso
        </a>
      </div>
    </div>
  `;
}

async function renderRecursos() {
  const container = document.getElementById("recursosGrid");
  const recursos = await fetchRecursos();

  container.innerHTML = recursos.map(recurso => {
    if (recurso.tipo.toLowerCase() === "video") {
      return renderVideoCard(recurso);
    }

    if (recurso.tipo.toLowerCase() === "pdf") {
      return renderPDFCard(recurso);
    }

    return renderGenericCard(recurso);
  }).join("");
}

// =============================
// iNICIALIZAR
// =============================

initMapData();
renderKPIs();
renderRecursos();