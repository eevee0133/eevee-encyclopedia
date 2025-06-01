// Busca dados de Eevee na PokéAPI
async function fetchEeveeData() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/eevee");
    const data = await response.json();
    return data;
}

// Busca as evoluções de Eevee
async function fetchEeveeEvolutions() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/133/");
    const data = await response.json();
    const evolutionChainUrl = data.evolution_chain.url;
    
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();
    return evolutionData;
}

// Mostra os dados na página
async function loadPage() {
    const eeveeData = await fetchEeveeData();
    const eeveeEvolutions = await fetchEeveeEvolutions();

    // Mostra info de Eevee
    document.getElementById("eevee-data").innerHTML = `
        <img src="${eeveeData.sprites.front_default}" alt="Eevee">
        <p><strong>Nome:</strong> ${eeveeData.name}</p>
        <p><strong>Tipo:</strong> ${eeveeData.types.map(t => t.type.name).join(", ")}</p>
        <p><strong>Altura:</strong> ${eeveeData.height / 10}m</p>
        <p><strong>Peso:</strong> ${eeveeData.weight / 10}kg</p>
    `;

    // Mostra evoluções (simplificado)
    const evolutions = eeveeEvolutions.chain.evolves_to;
    let evolutionsHTML = "";

    evolutions.forEach(evo => {
        evolutionsHTML += `
            <div class="pokemon-card">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.species.url.split('/')[6]}.png" alt="${evo.species.name}">
                <p>${evo.species.name}</p>
            </div>
        `;
    });

    document.getElementById("eevee-evolutions").innerHTML = evolutionsHTML;
}

// Carrega a página quando o site abrir
window.onload = loadPage;
