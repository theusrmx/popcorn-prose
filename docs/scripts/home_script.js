import { iniciarSlides } from "./image_slider.js";

const apiKey = '557439512040e55c35f758f339c8e1d1';
const BASE_URL = 'https://image.tmdb.org/t/p/original/';
const BASE_URL_LOGO = 'https://image.tmdb.org/t/p/original/';
let interval = 5000;

// Função para carregar os filmes populares
function loadPopularMovies() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const popularMovies = data.results;

            popularMovies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
            
                movieCard.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <p class="movie-title">${movie.title}</p>
                `;
            
                const movieCardsContainer = document.querySelector('.movie-cards');
                movieCardsContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar filmes populares:', error);
        });
}

function loadPopularSeries(){
    fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
        const popularSeries = data.results;
        

        popularSeries.forEach(tv => {
            const seriesCards = document.createElement('div');
            seriesCards.classList.add('movie-card');
            seriesCards.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}">
            <p class="movie-title">${tv.name}</p>
            `;
            const seriesCardsContainer = document.querySelector('.series-cards');
            seriesCardsContainer.appendChild(seriesCards);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar filmes populares:', error);
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
    let mensagemElement = document.getElementById('mensagemUser');
    const indiceAleatorio = Math.floor(Math.random() * mensagensAvaliacaoFilmes.length);
    mensagemElement.innerHTML = `${mensagensAvaliacaoFilmes[indiceAleatorio]}`
    //console.log(mensagensAvaliacaoFilmes[indiceAleatorio]);
}




const slideShowHome = iniciarSlides(apiKey, BASE_URL, BASE_URL_LOGO, interval, 'carouselExampleSlidesOnly', 'slide');


// Carregue os filmes populares ao carregar a página
window.addEventListener('load', () => {
    loadPopularMovies();
    loadPopularSeries();
    slideShowHome();
    exibirMensagemAleatoria(mensagensAvaliacaoFilmes);
});
