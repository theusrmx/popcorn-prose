const apiKey = '557439512040e55c35f758f339c8e1d1';
const searchResultsDiv = document.getElementById('search-results');

function criarCard(midia, titulo, ano, resumo, id) {
    const cartaoDiv = document.createElement('div');
    cartaoDiv.classList.add('card-result');
    cartaoDiv.innerHTML = `
        <div class="left-column">
            <img src="https://image.tmdb.org/t/p/w500${midia.poster_path}" alt="${titulo} Poster">
        </div>
        <div class="right-column">
            <h1 class="movie-title">${titulo}<span>(${ano})</span></h1>
            <p>${resumo}</p>
        </div>
    `;

    // Adicionar evento de clique para redirecionar para a página de detalhes
    cartaoDiv.addEventListener('click', () => {
        const tipoConteudo = midia.media_type; 
        window.location.href = `movie_page.html?id=${id}&mediaType=${tipoConteudo}`;
    });

    return cartaoDiv;
}

//Function para carregar os filmes populares do dia na API.
function carregarFilmesPopulares() {
    const searchHeading = document.getElementById('search-header');
    searchHeading.innerHTML = `Filmes e séries populares`;
    //Faz a requição para a API
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const filmesPopulares = data.results;
            filmesPopulares.forEach(filme => {
                if (filme.poster_path && filme.overview) {
                    //cria um card para cada filme
                    const cartaoFilme = criarCard(filme, filme.title, filme.release_date.slice(0, 4), filme.overview, filme.id);
                    searchResultsDiv.appendChild(cartaoFilme);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar filmes populares:', error);
        });
}

//Function para carregar as séries populares do dia na API
function carregarSeriesPopulares() {
    //Faz a requisição para a API
    fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const seriesPopulares = data.results;
            seriesPopulares.forEach(serie => {
                if (serie.poster_path && serie.overview) {
                    //cria um card para cada filme
                    const cartaoSerie = criarCard(serie, serie.name, serie.first_air_date.slice(0, 4), serie.overview, serie.id);
                    searchResultsDiv.appendChild(cartaoSerie);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar séries populares:', error);
        });
}

function pesquisarFilmes() {
    const entradaPesquisa = document.querySelector('input[type="text"]');
    const consultaPesquisa = entradaPesquisa.value;

    // Limpar os resultados de pesquisa anteriores
    searchResultsDiv.innerHTML = "";
    const searchHeading = document.getElementById('search-header');
    searchHeading.innerHTML = `Buscando por: <span>${consultaPesquisa}<span>`;


    if (consultaPesquisa.trim() === "") {
        // Se a consulta de pesquisa estiver em branco, carregue os filmes populares em vez disso após apagar todo o conteudo (caso tenha algo)
        searchResultsDiv.innerHTML = "";
        carregarFilmesPopulares();
        carregarSeriesPopulares();
        return;
    }

    

    
    // Fazer uma solicitação à API TMDB para pesquisa de filmes
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${consultaPesquisa}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {

            

            const resultadosPesquisa = data.results;
            resultadosPesquisa.forEach(filme => {
               let tipoConteudo = filme.media_type;
               let tituloConteudo;
               let dataLancamento;
               
               //verificação de tipo de midia para adequar a requisição a cada uma
               if(tipoConteudo === 'movie'){
                tituloConteudo = filme.title;
                dataLancamento = filme.release_date.slice(0,4);
               } else {
                tituloConteudo = filme.name;
                dataLancamento = filme.first_air_date.slice(0, 4);
               }

               const card = criarCard(filme, tituloConteudo, dataLancamento, filme.overview, filme.id);

               // Adicione o card criado ao searchResultsDiv
               searchResultsDiv.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao executar a pesquisa:', error);
        });
}


// Adicionar evento de clique ao botão de pesquisa
const botaoPesquisa = document.querySelector('button');
botaoPesquisa.addEventListener('click', pesquisarFilmes);

//carrega as funçoes de filmes populares ao carregar a página
window.addEventListener('load', () => {
    carregarFilmesPopulares();
    carregarSeriesPopulares();
});
