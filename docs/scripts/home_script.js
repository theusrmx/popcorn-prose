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
                
                //Retirar loader ao carregar a página
                //loadingBackground.style.display = 'none';
                //loadingIndicator.style.display = 'none';
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
    let mensagemElement = document.getElementById('mensagemUser');
    const indiceAleatorio = Math.floor(Math.random() * mensagensAvaliacaoFilmes.length);
    mensagemElement.innerHTML = `${mensagensAvaliacaoFilmes[indiceAleatorio]}`
    //console.log(mensagensAvaliacaoFilmes[indiceAleatorio]);
}


const slideShowHome = iniciarSlides(apiKey, BASE_URL, BASE_URL_LOGO, interval, 'slideHome', 'slide');

window.addEventListener('load', () => {
    carregarConteudoPopular('movie', '.movie-cards');
    carregarConteudoPopular('tv', '.series-cards');
    slideShowHome();
    exibirMensagemAleatoria(mensagensAvaliacaoFilmes);
});
  

console.log(localStorage.getItem('name'))

document.addEventListener('DOMContentLoaded', function() {
    // Recupere o nome do usuário do localStorage
    const nomeUsuario = localStorage.getItem('name');

    // Verifique se o nome do usuário existe e não é nulo
    if (nomeUsuario) {
        // Atualize o conteúdo do elemento "Bem vindo, John!"
        document.querySelector('.welcome-message h1').textContent = `Bem vindo, ${nomeUsuario}!`;
    }

});

document.addEventListener('DOMContentLoaded', function() {
    // Recupere o token do localStorage
    const token = localStorage.getItem('token');

    // Se houver um token, o usuário está logado
    if (token) {
        // Remova o link de login
        const linkLogin = document.querySelector('.navbar-nav .nav-link[href="login.html"]');
        if (linkLogin) {
            linkLogin.parentElement.style.display = 'none';
        }

        // Adicione os links "Meus Filmes" e "Deslogar"
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
            const linkMeusFilmes = criarLink('user.html', 'Meus Filmes');
            const linkDeslogar = criarLink('#', 'Deslogar', deslogar);

            navbarNav.appendChild(linkMeusFilmes);
            navbarNav.appendChild(linkDeslogar);
        }
    } else {
        // Se não houver token, o usuário não está logado
        // Remova os links "Meus Filmes" e "Deslogar"
        const linkMeusFilmes = document.querySelector('.navbar-nav .nav-link[href="user.html"]');
        const linkDeslogar = document.querySelector('.navbar-nav .nav-link[href="#"]');

        if (linkMeusFilmes) {
            linkMeusFilmes.parentElement.style.display = 'none';
        }

        if (linkDeslogar) {
            linkDeslogar.parentElement.style.display = 'none';
        }
    }
});

// Função auxiliar para criar um elemento de link
function criarLink(href, texto, onClick) {
    const link = document.createElement('li');
    link.classList.add('nav-item');
    const a = document.createElement('a');
    a.classList.add('nav-link');
    a.href = href;
    a.textContent = texto;
    if (onClick) {
        a.addEventListener('click', onClick);
    }
    link.appendChild(a);
    return link;
}

// Função de logout
function deslogar() {
    // Remova o token do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    // Redirecione para a página de login
    window.location.href = 'login.html';
}
