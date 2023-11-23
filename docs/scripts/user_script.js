const myAPIUrl = "http://localhost:8080";

const userID = localStorage.getItem('id');
const userName = localStorage.getItem('name');

const apiKey = '557439512040e55c35f758f339c8e1d1';

console.log(userID);
console.log(userName);

// Mostrar todas as minhas avaliações
function minhasReviews() {
    // Fetch para a API REST
    fetch(myAPIUrl + `/review/getAllReviews?idUser=${userID}`)
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
function personalizarPerfil(){
    const nomeUser = document.getElementById('nomeUsuario');
    const nome = localStorage.getItem('name');
    const sobrenome = localStorage.getItem('surname');

    nomeUser.innerHTML = nome + ' ' + sobrenome;
}

function enviarImagemParaBackend(imagem) {
    const userId = localStorage.getItem('id');

    const formData = new FormData();
    formData.append('fotoPerfil', imagem);

    fetch(myAPIUrl + `/auth/adicionar-foto/${userId}`, {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        atualizarFotoPerfil();
    })
    .catch(error => {
        console.error('Erro ao enviar a foto:', error.message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('minhaFoto');
    const fotoPerfil = document.querySelector('.fotoPerfil');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const novaImagem = e.target.result;
                fotoPerfil.src = novaImagem;

                // Aqui você pode adicionar lógica para enviar a imagem para o backend
                enviarImagemParaBackend(file);
            };

            reader.readAsDataURL(file);
        }
    });
});

function atualizarFotoPerfil() {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    // Faça a requisição para obter a nova foto de perfil
    fetch(myAPIUrl + `/auth/getPhoto/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error('Erro ao obter a foto do usuário');
            throw new Error('Erro ao obter a foto do usuário');
        }
        return response.blob(); // Retorna a resposta como um objeto Blob
    })
    .then(photoBlob => {
        // Converte o Blob para uma URL de dados (Data URL)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(photoBlob);
        });
    })
    .then(photoDataURL => {
        // Atualize a imagem de perfil na interface do usuário
        const fotoPerfil = document.querySelector('.fotoPerfil');
        fotoPerfil.src = photoDataURL;
    })
    .catch(error => {
        console.error('Erro:', error.message);
    });
}


window.addEventListener('load', function() {
    minhasReviews();
    personalizarPerfil();
    atualizarFotoPerfil();
});