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

window.addEventListener('load', async () => {
    try {
      // Mostra o indicador de carregamento
      const loadingBackground = document.getElementById('background-loader');
      const loadingIndicator = document.getElementById('loader');
      loadingBackground.style.display = 'flex';
      loadingIndicator.style.display = 'flex';
  
      // Aguarde o carregamento do conteúdo popular para filmes
      await carregarConteudoPopular('movie', '.movie-cards');
  
      // Aguarde o carregamento do conteúdo popular para séries
      await carregarConteudoPopular('tv', '.series-cards');
  
      // Execute a função para configurar o slideshow na home
      slideShowHome();
  
      // Execute a função para exibir uma mensagem aleatória
      exibirMensagemAleatoria(mensagensAvaliacaoFilmes);
    } catch (error) {
      console.error('Erro durante o carregamento da página:', error);
    } finally {
      // Oculta o indicador de carregamento
      const loadingBackground = document.getElementById('background-loader');
      const loadingIndicator = document.getElementById('loader');
      loadingBackground.style.display = 'none';
      loadingIndicator.style.display = 'none';
    }
  });
  