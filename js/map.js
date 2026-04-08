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

// =============================
// CAPA BASE
// =============================
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// =============================
// DATOS DE PRUEBA
// luego esto vendrá desde sheets
// =============================
const biofabricas = [
  {
    id: 1,
    name: "Biofábrica Central",
    lat: 9.93,
    lng: -84.08,
    region: "San José",
    estado: "Activa",
    descripcion:
      "Centro principal dedicado al compostaje y tratamiento orgánico.",
    tags: ["Compostaje", "Capacitación", "Circular"]
  },
  {
    id: 2,
    name: "Biofábrica Norte",
    lat: 10.3,
    lng: -84.4,
    region: "Alajuela",
    estado: "Activa",
    descripcion:
      "Nodo regional para producción de biofertilizantes.",
    tags: ["Biofertilizantes", "Regional"]
  }
];

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
      src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800"
      alt="${bio.name}"
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
// MARCADORES
// =============================
const markers = [];

biofabricas.forEach((bio) => {
  const marker = L.marker([bio.lat, bio.lng], {
    icon: greenIcon
  }).addTo(map);

  marker.bindPopup(`
    <strong>${bio.name}</strong><br>
    ${bio.region}<br>
    <small>Haz clic para ver ficha</small>
  `);

  marker.on("click", () => {
    renderPanel(bio);

    map.flyTo([bio.lat, bio.lng], 10, {
      duration: 1.2
    });
  });

  markers.push({ marker, bio });
});

// =============================
// BÚSQUEDA
// =============================
const searchInput = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

function searchBiofabrica() {
  const query = searchInput.value.toLowerCase().trim();

  const result = markers.find(item =>
    item.bio.name.toLowerCase().includes(query) ||
    item.bio.region.toLowerCase().includes(query)
  );

  if (result) {
    map.flyTo(
      [result.bio.lat, result.bio.lng],
      10,
      { duration: 1 }
    );

    result.marker.openPopup();
    renderPanel(result.bio);
  } else {
    alert("No se encontró la biofábrica.");
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

  map.flyTo([9.93, -84.08], 8, {
    duration: 1
  });

  panel.innerHTML = `
    <img 
      src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800"
      alt="Biofábrica"
    />

    <div class="card-content">
      <h3>Selecciona una biofábrica</h3>
      <p>Haz clic en un marcador para ver la ficha.</p>
    </div>
  `;
});

// =============================
// PANEL INICIAL
// =============================
resetBtn.click();