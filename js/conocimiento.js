let recursos = [];

async function renderRecursos(){

    const grid =
    document.getElementById("recursosGrid");

    recursos =
    await fetchRecursos();

    grid.innerHTML =
    recursos.map(r=>`

        <div class="resource-card">

            <div class="resource-content">

                <h3>${r.nombre}</h3>

                <p>${r.categoria}</p>

                <a href="${r.enlace}"
                   target="_blank">

                   Abrir

                </a>

            </div>

        </div>

    `).join("");
}

renderRecursos();