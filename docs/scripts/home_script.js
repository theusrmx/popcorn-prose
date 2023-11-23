import { iniciarSlides } from "./image_slider.js";

const apiKey = '557439512040e55c35f758f339c8e1d1';
const BASE_URL = 'https://image.tmdb.org/t/p/original/';
const BASE_URL_LOGO = 'https://image.tmdb.org/t/p/original/';
let interval = 5000;


//Função para carrregar conteudo popular de acordo com o paramento TIPO MIDIA - TV OU MOVIE
function carregarConteudoPopular(tipoMidia, elementoHTML) {
    const midiaRequisitada = tipoMidia;
    const elemento = document.querySelector(elementoHTML);

    fetch(`https://api.themoviedb.org/3/trending/${midiaRequisitada}/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const midiaPopular = data.results;

            midiaPopular.forEach(midia => {
                const idMidia = midia.id;
                const nomeMidia = midiaRequisitada === 'movie' ? midia.title : midia.name;
                const urlPoster = midia.poster_path;

                const midiaCard = document.createElement('div');
                midiaCard.classList.add('movie-card');

                midiaCard.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${urlPoster}" alt="${nomeMidia}">
                    <p class="movie-title">${nomeMidia}</p>
                `;

                // Adicionar evento de clique para redirecionar para a página de detalhes
                midiaCard.addEventListener('click', () => {
                    window.location.href = `movie_page.html?id=${idMidia}&mediaType=${midiaRequisitada}`;
                });

                elemento.appendChild(midiaCard);
            });
        })
        .catch(error => {
            console.error(`Erro ao carregar mídias populares (${tipoMidia}):`, error);
        });
}


const mensagensAvaliacaoFilmes = [
    "A magia do cinema está em sua opinião.",
    "Sua visão única faz toda a diferença.",
    "Você é a estrela da sua própria crítica. Brilhe!",
    "Que tal transformar sua última sessão em palavras?",
    "A cena é sua!", 
    "A Força é poderosa em você.",
    "Hakuna Matata!",
    "Luz, câmera, ação!"
];
  
function exibirMensagemAleatoria() {
    const token = localStorage.getItem('token');
    let mensagemElement = document.getElementById('mensagemUser');
    if(token){//se estiver logado, exibir a mensagem aleatória
        const indiceAleatorio = Math.floor(Math.random() * mensagensAvaliacaoFilmes.length);
        mensagemElement.innerHTML = `${mensagensAvaliacaoFilmes[indiceAleatorio]}`;
    }else{
        mensagemElement.innerHTML = "Faça o login para começar (ou continuar) seu diário cinematográfico!";
    }
}

function recuperarQntReviews() {
    let nmrFilmes = 0;
    let nmrSeries = 0;
    const userId = localStorage.getItem('id');

    fetch(`http://localhost:8080/review/getAllReviews?idUser=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Avaliações obtidas com sucesso:", data);

            const reviews = data;

            // Preencher cards de avaliações
            reviews.forEach(review => {
                if (review.tipoMidia === 'movie') {
                    nmrFilmes++;
                } else if (review.tipoMidia === 'tv') {
                    nmrSeries++;
                }
            });
            // Atualizar os valores no localStorage
            localStorage.setItem('nmrFilmes', nmrFilmes);
            localStorage.setItem('nmrSeries', nmrSeries);

            console.log('Quantidade de filmes:', nmrFilmes);
            console.log('Quantidade de séries:', nmrSeries);
        })
        .catch(error => {
            console.error("Erro ao obter avaliações:", error.message);
        });
}

function exibirInfoUsuario() {
    const token = localStorage.getItem('token');
    const infoFilmes = document.getElementById('infoFilmes');
    const infoSeries = document.getElementById('infoSeries');
    const btnLogin = document.getElementById('btnLogin');
    const spanFilme = document.getElementById('spanFilmes');
    const spanSerie = document.getElementById('spanSeries');

    if (!token) {
        // Se não tiver token, não exibirá as informações
        infoFilmes.style.display = 'none';
        infoSeries.style.display = 'none';
        btnLogin.style.display = 'block';
    } else {
        // Se tiver token, exibir as informações
        infoFilmes.style.display = 'block';
        infoSeries.style.display = 'block';

        // Obter valores do localStorage ou definir como 0 se estiver vazio
        const nmrFilmes = localStorage.getItem('nmrFilmes') || 0;
        const nmrSeries = localStorage.getItem('nmrSeries') || 0;
        spanFilme.innerHTML = nmrFilmes;
        spanSerie.innerHTML = nmrSeries;
        btnLogin.style.display = 'none';
    }
}



function exibirNomeUsuario() {
    const nomeUsuario = localStorage.getItem('name');
    const welcomeMessage = document.querySelector('.welcome-message h1');

    if (nomeUsuario && welcomeMessage) {
        welcomeMessage.textContent = `Bem vindo, ${nomeUsuario}!`;
    }
}

console.log(localStorage.getItem('id'))
console.log(localStorage.getItem('name'))


const slideShowHome = iniciarSlides(apiKey, BASE_URL, BASE_URL_LOGO, interval, 'slideHome', 'slide');

window.addEventListener('load', () => {
    carregarConteudoPopular('movie', '.movie-cards');
    carregarConteudoPopular('tv', '.series-cards');
    slideShowHome();
    exibirMensagemAleatoria(mensagensAvaliacaoFilmes);
    exibirNomeUsuario();
    exibirInfoUsuario();
    recuperarQntReviews();
});
