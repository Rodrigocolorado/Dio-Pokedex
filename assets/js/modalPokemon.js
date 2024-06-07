const modal = document.getElementById("modalPokemon");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const arrayStatsTitulo = Array.from(document.getElementsByClassName("stats__item--titulo"));
const arrayAbasDesc = Array.from(document.getElementsByClassName("description__aba"));

const nomeDoPokemon = document.getElementById("nomeDoPokemon");
const numeroDoPokemon = document.getElementById("numeroDoPokemon");
const tiposDoPokemon = document.getElementById("tiposDoPokemon");
const imagemDoPokemon = document.getElementById("imagemDoPokemon");
const especieDoPokemon = document.getElementById("especieDoPokemon");
const alturaDoPokemon = document.getElementById("alturaDoPokemon");
const pesoDoPokemon = document.getElementById("pesoDoPokemon");
const habilidadesDoPokemon = document.getElementById("habilidadesDoPokemon");
const vidaDoPokemon = document.getElementById("vidaDoPokemon");
const ataqueDoPokemon = document.getElementById("ataqueDoPokemon");
const defesaDoPokemon = document.getElementById("defesaDoPokemon");
const spatkDoPokemon = document.getElementById("spatkDoPokemon");
const spdefDoPokemon = document.getElementById("spdefDoPokemon");
const velDoPokemon = document.getElementById("velDoPokemon");
const evoChain = document.getElementById("evoChain");

function abrirModalDoPokemon(idDoPokemon) {
    Promise.all([pegarStatsDoPokmeon(idDoPokemon), pegarEvolucoes(idDoPokemon)])
        .then( modal.showModal() )  
}

function pegarStatsDoPokmeon(idDoPokemon) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${idDoPokemon}`)
        .then((response) => response.json())
        .then(povoarModalDoPokemon);
}

function povoarModalDoPokemon(pokemon) {
    modal.classList.remove(...modal.classList);
    modal.classList.add(`modal__container`);
    modal.classList.add(`${pokemon.types[0].type.name}`);

    nomeDoPokemon.innerHTML = pokemon.name;
    numeroDoPokemon.innerHTML = `# ${pokemon.id}`;

    tiposDoPokemon.innerHTML = "";
    pokemon.types.map((tipo) => {
        tiposDoPokemon.innerHTML += `<span class="type ${tipo.type.name}">${tipo.type.name}</span>`;
    });

    imagemDoPokemon.src = pokemon.sprites.other.dream_world.front_default;
    especieDoPokemon.innerHTML = pokemon.species.name;
    alturaDoPokemon.innerHTML = `${pokemon.height / 10} m`;
    pesoDoPokemon.innerHTML = `${pokemon.weight} Kg`;

    habilidadesDoPokemon.innerHTML = "";
    pokemon.abilities.map((habilidade) => {
        const textoAAdicionar =
            habilidade.ability.name[0].toUpperCase() +
            habilidade.ability.name.substring(1);
        if (
            pokemon.abilities.indexOf(habilidade) <
            pokemon.abilities.length - 1
        ) {
            habilidadesDoPokemon.innerHTML += `${textoAAdicionar}, `;
        } else {
            habilidadesDoPokemon.innerHTML += `${textoAAdicionar}.`;
        }
    });

    vidaDoPokemon.innerHTML = `<span>${pokemon.stats[0].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[0].base_stat * 100) / 150}%; background: ${pokemon.stats[0].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
    ataqueDoPokemon.innerHTML = `<span>${pokemon.stats[1].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[1].base_stat * 100) / 150}%; background: ${pokemon.stats[1].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
    defesaDoPokemon.innerHTML = `<span>${pokemon.stats[2].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[2].base_stat * 100) / 150}%; background: ${pokemon.stats[2].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
    spatkDoPokemon.innerHTML = `<span>${pokemon.stats[3].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[3].base_stat * 100) / 150}%; background: ${pokemon.stats[3].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
    spdefDoPokemon.innerHTML = `<span>${pokemon.stats[4].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[4].base_stat * 100) / 150}%; background: ${pokemon.stats[4].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
    velDoPokemon.innerHTML = `<span>${pokemon.stats[5].base_stat}</span><span class="description__range"><div style="width: ${(pokemon.stats[5].base_stat * 100) / 150}%; background: ${pokemon.stats[5].base_stat > 49 ? "lightgreen" : "red"};"></div></span>`;
}

botaoFecharModal.addEventListener("click", () => { modal.close(); });

arrayStatsTitulo.map((elementoHTML) => {
    elementoHTML.addEventListener("click", (evento) => {
        arrayStatsTitulo.map((elemento) => {
            elemento.classList.remove("item__ativo");
        });
        arrayAbasDesc.map((elemento) => {
            elemento.classList.remove("item__ativo");
        });

        evento.target.classList.add("item__ativo");
        arrayAbasDesc[arrayStatsTitulo.indexOf(evento.target)].classList.add("item__ativo");
    });
});

function pegarEvolucoes(idDoPokemon) {
    let evolutions = [];

    let evolutionChainURL = fetch(`https://pokeapi.co/api/v2/pokemon-species/${idDoPokemon}`)
        .then((response) => response.json())
        .then((species) => evolutionChainURL = species.evolution_chain.url)
        .then( (evolutionChainURL => {
            fetch(evolutionChainURL)
                .then((response) => response.json())
                .then((response) => {
                    evolution0 = response.chain.species.name;
                    evolutions.push({name: evolution0});
                    if (response.chain.evolves_to.length > 0) {
                        evolution1 = response.chain.evolves_to[0].species.name;
                        evolutions.push({name: evolution1});
                        if (response.chain.evolves_to[0].evolves_to.length > 0) {
                            evolution2 =
                                response.chain.evolves_to[0].evolves_to[0].species.name;
                            evolutions.push({name: evolution2});
                        }
                    }

                    evoChain.innerHTML=`<h3 class="evo__title">Evolution Chain</h3>`
        
                    Promise.allSettled(
                        evolutions.map((evolucao, index) => {
                            fetch(`https://pokeapi.co/api/v2/pokemon/${evolucao.name}`)
                                .then((response) => response.json())
                                .then((evolucaoJson) => {
                                    evolutions[index].img = evolucaoJson.sprites.other.dream_world.front_default
                                })
                                .finally( results => {
                                    if (evolutions.length > 1 && index > 0 ) {
                                        evoChain.innerHTML += `<div class="evo__row">
                                                                    <div class="evo__cell">
                                                                        <img
                                                                            class="pokemon__evo--imagem"
                                                                            src=${evolutions[index - 1].img}
                                                                            alt="imagem de ${evolutions[index-1].name}"
                                                                        />
                                                                        <span>${evolutions[index-1].name}</span>
                                                                    </div>
                                                                    <div class="evo__cell">
                                                                        <span class="evo__cell--pointer">➡</span>
                                                                    </div>
                                                                    <div class="evo__cell">
                                                                        <img
                                                                            class="pokemon__evo--imagem"
                                                                            src=${evolutions[index].img}
                                                                            alt="imagem de ${evolutions[index].name}"
                                                                        />
                                                                        <span>${evolutions[index].name}</span>
                                                                    </div>
                                                                </div>`
                                    } else if (evolutions.length == 1) {
                                        evoChain.innerHTML += `<div class="evo__cell">
                                                                    <img
                                                                        class="pokemon__evo--imagem"
                                                                        src=${evolutions[index].img}
                                                                        alt="imagem de ${evolutions[index].name}"
                                                                    />
                                                                    <span>${evolutions[index].name}</span>
                                                                    <span>Este pokemon não tem evoluções.</span>
                                                                </div>`
                                    }
                                }
                                )
                        }))
                    })       
        }))
}