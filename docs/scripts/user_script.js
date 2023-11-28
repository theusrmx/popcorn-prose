const myAPIUrl = "http://localhost:8080";
//const myAPIUrl = "https://popcorn-prose-server.vercel.app";

const userID = localStorage.getItem('id');
const userName = localStorage.getItem('name');
const token = localStorage.getItem('token');
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
            mostrarMensagemSemAvaliacoes();
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
                    <a href="${`movie_page.html?id=${avaliacao.idFilme}&mediaType=${avaliacao.tipoMidia}`}" style="text-decoration: none">
                    <i class="fas fa-pen" style="color: green; font-size: 30px; cursor: pointer; padding: 10px"></i>
                    </a>
                    <i class="fas fa-trash-alt" style="color: red; font-size: 30px; cursor: pointer; padding:10px" onclick="excluirReview(${avaliacao.idFilme})"></i>
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

function mostrarMensagemSemAvaliacoes() {
    const cardAvaliacao = document.createElement('div');
    cardAvaliacao.innerHTML = `<h4 class="semReviewText">Quando você avaliar um filme ou uma série, ele aparecerá aqui!</h4>`;
    const cardContainer = document.getElementById('cardAvaliacao');
    if (cardContainer) {
        cardContainer.appendChild(cardAvaliacao);
    } else {
        console.error("Elemento 'cardAvaliacao' não encontrado no DOM.");
    }
}

// Função para criar estrelas com base no número de estrelas
function criarEstrelas(numEstrelas) {
    let estrelasHTML = '';
    for (let i = 0; i < numEstrelas; i++) {
        estrelasHTML += '<i class="rating__star fas fa-star"></i>';
    }
    return estrelasHTML;
}


//Lista de desejos
function minhaListaDesejos() {
    // Fetch para a API REST
    fetch(myAPIUrl + `/lista-desejos/listar/${userID}`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    })
    .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Lista de desejos obtida com sucesso:", data);

            // Suponho que o objeto retornado tenha uma propriedade chamada 'filmes' que é uma lista de filmes na lista de desejos
            const filmesNaLista = data;

            // Preencher cards da lista de desejos
            filmesNaLista.forEach(filme => {
                criarCardListaDesejos(filme);
            });

            // Verificar se a lista de desejos está vazia
            if (!data || data.length === 0) {
                mostrarMensagemSemDesejos();
            }
        })
        .catch(error => {
            console.error("Erro ao obter lista de desejos:", error.message);
            mostrarMensagemSemDesejos();
        });
}

function criarCardListaDesejos(filme) {
    // Crie um card de lista de desejos
    const cardDesejo = document.createElement('div');
    cardDesejo.classList.add('card-avaliacao');

    // Consulte a TMDB API para obter detalhes do filme, incluindo o poster
    fetch(`https://api.themoviedb.org/3/${filme.tipoMidia}/${filme.idFilme}?api_key=${apiKey}&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
        if (data.poster_path) {
            const posterPath = data.poster_path;
            const dataLancamento = (data.release_date || data.first_air_date)?.substring(0, 4) || 'N/A'; // Ano de lançamento
            const tituloFilme = filme.tipoMidia === 'movie' ? data.title : data.name; //verificação para qual dado recuperar, title (filmes) ou name (series)
            const sinopse = data.overview;
    // Preencha o conteúdo do card da lista de desejos
    cardDesejo.innerHTML = `
        <div class="left-column">
            <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="Poster">
        </div>
        <div class="right-column">
            <p class="titulo-filme">${tituloFilme}<span>(${dataLancamento})</span></p>
            <p class="sinopse">${sinopse}</p>
            <div>
            
            <a href="${`movie_page.html?id=${filme.idFilme}&mediaType=${filme.tipoMidia}`}" style="text-decoration: none">
                <i class="fas fa-check" style="color: green; font-size: 30px; cursor: pointer; padding: 10px"></i>
            </a>

            <i class="fas fa-trash-alt" style="color: red; font-size: 30px; cursor: pointer; padding:10px" onclick="excluirItemLista(${filme.idFilme})"></i>
            </div>

        </div>
    `;
    
    document.getElementById('cardLista').appendChild(cardDesejo);
        } else {
            console.error("Erro ao obter detalhes do filme: Poster path não encontrado");
        }
    })
    .catch(error => {
    console.error("Erro ao obter detalhes do filme:", error.message);
    });
}

function mostrarMensagemSemDesejos() {
    const cardDesejo = document.createElement('div');
    cardDesejo.innerHTML = `<h4 class="semReviewText">Sua lista de desejos está vazia!</h4>`;
    const cardContainer = document.getElementById('cardLista');
    if (cardContainer) {
        cardContainer.appendChild(cardDesejo);
    } else {
        console.error("Elemento 'cardDesejo' não encontrado no DOM.");
    }
}

function excluirItemLista(idFilme) {
    fetch(myAPIUrl + `/lista-desejos/deletar/${idFilme}/${userID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Se a exclusão for bem-sucedida, recarregue a página
        if (data.mensagem === "Filme removido com sucesso") {
            location.reload();
        } else {
            // Se houver um erro, exiba uma mensagem de erro ou realize outra ação apropriada
            console.error(data.erro);
            alert("Erro ao remover filme da lista");
        }
    })
    .catch(error => {
        console.error("Erro ao excluir filme:", error);
        alert("Erro ao excluir filme");
    });
}

function excluirReview(idFilme){
    if (!confirm("Tem certeza de que deseja excluir essa review?")) {
        return;
    }

    fetch(myAPIUrl + `/review/deleteReview?idFilme=${idFilme}&idUser=${userID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir review.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Review excluída com sucesso:', data);
        alert("Review excluída com sucesso!");
        location.reload();
    })
    .catch(error => {
        console.error('Erro ao excluir review:', error.message);
        alert("Ocorreu um erro ao excluir a review.");
    });
}

///////////////////////////////////////////////// PERSONALIZAÇÃO DO USUARIO ////////////////////////////////////////////////////////////////////////////////////
function personalizarPerfil(){
    const nomeUser = document.getElementById('nomeUsuario');
    const nome = localStorage.getItem('name');
    const sobrenome = localStorage.getItem('surname');

    nomeUser.innerHTML = nome + ' ' + sobrenome;
}
async function enviarImagemParaBackend(imagem) {
    try {
        const userId = localStorage.getItem('id');

        // Verificar se o arquivo é uma imagem JPEG, JPG ou PNG
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(imagem.type)) {
            console.error('Tipo de arquivo inválido. Por favor, escolha uma imagem JPEG, JPG ou PNG.');
            return;
        }

        const maxSize = 2000; // Tamanho máximo em pixels
        const maxAspectRatio = 1.0; // Proporção largura/altura
        const maxFileSize = 2 * 1024 * 1024; // 2 MB

        const image = new Image();
        image.src = URL.createObjectURL(imagem);

        await new Promise(resolve => image.onload = resolve);

        if (image.width > maxSize || image.height > maxSize || image.width / image.height > maxAspectRatio) {
            alert("Tente outra imagem!")
            location.reload();
            console.error('A imagem deve ter no máximo 500x500 pixels e uma proporção aceitável.');
            return;
        }

        // Verificar tamanho total do arquivo (em bytes)
        if (imagem.size > maxFileSize) {
            console.error('O tamanho do arquivo excede o limite máximo de 2 MB.');
            alert("Tente outra imagem!")
            location.reload();
            return;
        }

        const formData = new FormData();
        formData.append('fotoPerfil', imagem);

        const response = await fetch(myAPIUrl + `/auth/adicionar-foto/${userId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.text();
        console.log('Resposta do servidor:', data);
        atualizarFotoPerfil();
    } catch (error) {
        console.error('Erro ao enviar a foto:', error.message);
        alert('Erro ao enviar a foto. Por favor, tente novamente mais tarde.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('minhaFoto');
    const fotoPerfil = document.querySelector('.fotoPerfil');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            // Verificar se o arquivo é uma imagem antes de ler
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const novaImagem = e.target.result;
                    fotoPerfil.src = novaImagem;

                    // Aqui você pode adicionar lógica para enviar a imagem para o backend
                    enviarImagemParaBackend(file);
                };

                reader.readAsDataURL(file);
            } else {
                console.error('Por favor, escolha um arquivo de imagem válido.');
                alert('Por favor, escolha um arquivo de imagem válido.');
            }
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

////////////////////////////////////////////////////////////////////////////////////// PONTUAÇÃO //////////////////////////////////////////////////////////////////////////////////////
const totalReviews = localStorage.getItem('totalReviews')
function calcularPontuação(totalReviews){
    const iconPontuacao = document.getElementById('iconPontuacao');
    const textoPontuacao = document.getElementById('textoPontuacao');
    const iconPadrao = document.getElementById('iconPadrao');

    iconPadrao.style.display = 'none';

    switch (true) {
        case totalReviews < 10:
            iconPontuacao.src = './assets/icons_pontuacao/icon1.png';
            textoPontuacao.innerText = 'Iniciante do cinema';
            break;
        case totalReviews >= 10 && totalReviews < 20:
            iconPontuacao.src = './assets/icons_pontuacao/icon2.png';
            textoPontuacao.innerText = 'Cinéfilo em ascensão';
            break;
        case totalReviews >= 20 && totalReviews < 30:
            iconPontuacao.src = './assets/icons_pontuacao/icon3.png';
            textoPontuacao.innerText = 'Amante de filmes';
            break;
        case totalReviews >= 30 && totalReviews < 40:
            iconPontuacao.src = './assets/icons_pontuacao/icon4.png';
            textoPontuacao.innerText = 'Especialista da tela';
            break;
        case totalReviews >= 40 && totalReviews < 50:
            iconPontuacao.src = './assets/icons_pontuacao/icon5.png';
            textoPontuacao.innerText = 'Crítico de cinema';
            break;
        case totalReviews >= 50 && totalReviews < 60:
            iconPontuacao.src = './assets/icons_pontuacao/icon6.png';
            textoPontuacao.innerText = 'Gênio do cinema';
            break;
        case totalReviews >= 60 && totalReviews < 70:
            iconPontuacao.src = './assets/icons_pontuacao/icon7.png';
            textoPontuacao.innerText = 'Mestre da Sétima Arte';
            break;
        case totalReviews >= 70 && totalReviews < 80:
            iconPontuacao.src = './assets/icons_pontuacao/icon8.png';
            textoPontuacao.innerText = 'Mito dos filmes';
            break;
        case totalReviews >= 90 && totalReviews < 100:
                iconPontuacao.src = './assets/icons_pontuacao/icon9.png';
                textoPontuacao.innerText = 'Cinéfilo supremo';
                break;
        case totalReviews >= 100:
                iconPontuacao.src = './assets/icons_pontuacao/icon10.png';
                textoPontuacao.innerText = 'Lenda do filme';
                break;
        default:
            iconPadrao.style.display = 'block';
            break;
    }
}


window.addEventListener('load', function() {
    minhasReviews();
    minhaListaDesejos();
    personalizarPerfil();
    atualizarFotoPerfil();
    calcularPontuação(totalReviews);
});