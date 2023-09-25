
const apiKey = '557439512040e55c35f758f339c8e1d1';


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

// Carregue os filmes populares ao carregar a página
window.addEventListener('load', () => {
    loadPopularMovies();
    loadPopularSeries();
});
