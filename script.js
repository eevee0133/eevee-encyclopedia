// Busca dados básicos de Eevee
async function fetchEeveeData() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/eevee");
    const data = await response.json();
    return data;
}

// Busca a cadeia de evoluções de Eevee
async function fetchEeveeEvolutions() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/133/");
    const speciesData = await response.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;
    
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();
    return evolutionData;
}

// Busca todos os ataques de Eevee
async function fetchEeveeMoves() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/eevee");
    const data = await response.json();
    return data.moves;
}

// Busca as habilidades de Eevee
async function fetchEeveeAbilities() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/eevee");
    const data = await response.json();
    return data.abilities;
}

// Exibe os ataques na página
function displayMoves(moves) {
    let movesHTML = "";
    moves.slice(0, 30).forEach(move => { // Limita a 30 ataques para não sobrecarregar
        movesHTML += `
            <div class="move-card">
                <p><strong>${move.move.name.replace("-", " ")}</strong></p>
                <small>Método: ${move.version_group_details[0].move_learn_method.name}</small>
                <small>Nível: ${move.version_group_details[0].level_learned_at || "TM/Tutor"}</small>
            </div>
        `;
    });
    document.getElementById("eevee-moves").innerHTML = movesHTML;
}

// Exibe as habilidades na página
function displayAbilities(abilities) {
    let abilitiesHTML = "";
    abilities.forEach(ability => {
        abilitiesHTML += `
            <div class="ability-card">
                <p><strong>${ability.ability.name.replace("-", " ")}</strong></p>
                <p>${ability.is_hidden ? "(Habilidade Oculta)" : ""}</p>
            </div>
        `;
    });
    document.getElementById("eevee-abilities").innerHTML = abilitiesHTML;
}

// Lista de todas as Eeveelutions e métodos de evolução
const EEVEELUTIONS = [
    { name: "vaporeon", method: "Pedra Água" },
    { name: "jolteon", method: "Pedra Trovão" },
    { name: "flareon", method: "Pedra Fogo" },
    { name: "espeon", method: "Amizade + Dia" },
    { name: "umbreon", method: "Amizade + Noite" },
    { name: "leafeon", method: "Pedra Musgo" },
    { name: "glaceon", method: "Pedra Gelo" },
    { name: "sylveon", method: "Amizade + Ataque Fada" }
];

// Exibe detalhes das Eeveelutions
async function displayEeveelutions() {
    let eeveelutionsHTML = "";
    for (const eeveelution of EEVEELUTIONS) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${eeveelution.name}`);
        const data = await response.json();
        
        eeveelutionsHTML += `
            <div class="eeveelution-card">
                <img src="${data.sprites.other["official-artwork"].front_default || data.sprites.front_default}" alt="${eeveelution.name}">
                <p><strong>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</strong></p>
                <p>Tipo: ${data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}</p>
                <p>Evolui com: ${eeveelution.method}</p>
            </div>
        `;
    }
    document.getElementById("all-eeveelutions").innerHTML = eeveelutionsHTML;
}

// Carrega todos os dados quando a página é aberta
async function loadPage() {
    // Dados básicos de Eevee
    const eeveeData = await fetchEeveeData();
    document.getElementById("eevee-data").innerHTML = `
        <img src="${eeveeData.sprites.other["official-artwork"].front_default || eeveeData.sprites.front_default}" alt="Eevee">
        <p><strong>Nome:</strong> ${eeveeData.name.charAt(0).toUpperCase() + eeveeData.name.slice(1)}</p>
        <p><strong>Tipo:</strong> ${eeveeData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ")}</p>
        <p><strong>Altura:</strong> ${eeveeData.height / 10}m</p>
        <p><strong>Peso:</strong> ${eeveeData.weight / 10}kg</p>
    `;

    // Evoluções (simplificado)
    const evolutions = (await fetchEeveeEvolutions()).chain.evolves_to;
    let evolutionsHTML = "";
    evolutions.forEach(evo => {
        evolutionsHTML += `
            <div class="pokemon-card">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.species.url.split('/')[6]}.png" alt="${evo.species.name}">
                <p>${evo.species.name.charAt(0).toUpperCase() + evo.species.name.slice(1)}</p>
            </div>
        `;
    });
    document.getElementById("eevee-evolutions").innerHTML = evolutionsHTML;

    // Ataques, habilidades e Eeveelutions
    displayMoves(await fetchEeveeMoves());
    displayAbilities(await fetchEeveeAbilities());
    displayEeveelutions();
}

// Inicia tudo quando a página carregar
window.onload = loadPage;
