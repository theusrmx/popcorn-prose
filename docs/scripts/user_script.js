const myAPIUrl = "http://localhost:8080/review";

const userID = localStorage.getItem('id');
const userName = localStorage.getItem('name');

const apiKey = '557439512040e55c35f758f339c8e1d1';

console.log(userID);
console.log(userName);

// Mostrar todas as minhas avaliações
function minhasReviews() {
    // Fetch para a API REST
    fetch(myAPIUrl + `/getAllReviews?idUser=${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Avaliações obtidas com sucesso:", data);

            // Suponho que o objeto retornado tenha uma propriedade chamada 'reviews' que é uma lista de avaliações
            const reviews = data;

            // Preencher cards de avaliações
            reviews.forEach(review => {
                criarCardAvaliacao(review);
            });
        })
        .catch(error => {
            console.error("Erro ao obter avaliações:", error.message);
        });
}

function criarCardAvaliacao(avaliacao) {
    // Crie um card de avaliação
    const cardAvaliacao = document.createElement('div');
    cardAvaliacao.classList.add('card-avaliacao');

    // Consulte a TMDB API para obter detalhes do filme, incluindo o poster
    fetch(`https://api.themoviedb.org/3/${avaliacao.tipoMidia}/${avaliacao.idFilme}?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            if (data.poster_path) {
                const posterPath = data.poster_path;
                const dataLancamento = (data.release_date || data.first_air_date)?.substring(0, 4) || 'N/A'; // Ano de lançamento
                const tituloFilme = avaliacao.tipoMidia === 'movie' ? data.title : data.name; //verificação para qual dado recuperar, title (filmes) ou name (series)

                // Preencha o conteúdo do card de avaliação
                cardAvaliacao.innerHTML = `
                    <div class="left-column">
                        <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="Poster">
                    </div>
                    <div class="right-column">
                        <h3 class="titulo-filme">${tituloFilme}<span>(${dataLancamento})</span></h3>
                        <p class="comentario">${avaliacao.reviewFilme}</p>
                        <div class="rating">
                            <div class="rating">
                                ${criarEstrelas(avaliacao.numEstrelas)}
                            </div>
                        </div>
                        <div class="ver_comentario">
                            <a href="${`movie_page.html?id=${avaliacao.idFilme}&mediaType=${avaliacao.tipoMidia}`}" class="button-comentario">
                                Ver Comentário
                            </a>
                        </div>
                    </div>
                `;

                // Adicione este card à sua página onde você quiser
                document.getElementById('cardAvaliacao').appendChild(cardAvaliacao);
            } else {
                console.error("Erro ao obter detalhes do filme: Poster path não encontrado");
            }
        })
        .catch(error => {
            console.error("Erro ao obter detalhes do filme:", error.message);
        });
}


// Função para criar estrelas com base no número de estrelas
function criarEstrelas(numEstrelas) {
    let estrelasHTML = '';
    for (let i = 0; i < numEstrelas; i++) {
        estrelasHTML += '<i class="rating__star fas fa-star"></i>';
    }
    return estrelasHTML;
}


///////////////////////////////////////////////// PERSONALIZAÇÃO DO USUARIO ////////////////////////////////////////////////////////////////////////////////////




window.addEventListener('load', function() {
    minhasReviews();
});