/*****************************************************API**********************************/
const apiKey = '557439512040e55c35f758f339c8e1d1';

// Obtenha o ID do filme ou série da URL
const urlParams = new URLSearchParams(window.location.search);
const filmeId = urlParams.get('id');
const tipoMidia = urlParams.get('mediaType');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTc0Mzk1MTIwNDBlNTVjMzVmNzU4ZjMzOWM4ZTFkMSIsInN1YiI6IjY0ZTY5ZTUwN2Q1ZGI1MDEwMDk0YTk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rzZhbE5Ch2tJsyNtSEnx58QkQDTlVZlqAuhV2t7Sulg'
  }
};

const loadingBackground = document.getElementById('background-loader');
loadingBackground.setAttribute('aria-hidden', 'false');

const loadingIndicator = document.getElementById('loader');
loadingIndicator.style.display = 'flex';

// Verifique se o ID do filme ou série é válido (não vazio)
if (!filmeId) {
    console.error('ID do filme ou série não encontrado na URL.');
}

function montarPagina() {
  //Consulta na API referente ao filme clicado.
  fetch(`https://api.themoviedb.org/3/${tipoMidia}/${filmeId}?language=pt-BR`, options)
      .then(response => response.json())
      .then(data => {
          // Adapte para incluir a verificação da revisão existente
          const checkReviewData = {
              idFilme: filmeId,
              idUser: localStorage.getItem('id')
          };

          fetch('http://localhost:8080/review/getReview?idFilme=' + checkReviewData.idFilme + '&idUser=' + checkReviewData.idUser)
              .then(response => {
                  if (response.ok) {
                      return response.json();
                  } else {
                      return null;
                  }
              })
              .then(existingReview => {
                if (existingReview) {
                  console.log('Revisão existente:', existingReview);
          
                  const reviewInput = document.getElementById('reviewInput');
                  const ratingStars = document.getElementsByClassName('rating__star');
                  const labelReview = document.getElementById('labelForReview');
          
                  reviewInput.value = existingReview.reviewFilme;
                  labelReview.innerHTML = "Sua opinião:";
                  btnEnviarReview.style.display = 'none';
          
                  reviewInput.disabled = true;
          
                  executeRating(Array.from(ratingStars), existingReview);
              } else {
                  const ratingStars = document.getElementsByClassName('rating__star');
                  executeRating(Array.from(ratingStars));
              }
          
          
              })
              .catch(error => {
                  console.error('Erro ao verificar revisão:', error.message);
                 
              });

          //Busca pela logo do filme
          fetch(`https://api.themoviedb.org/3/${tipoMidia}/${filmeId}/images`, options)
              .then(response => response.json())
              .then(dadosLogo => {
                  const logoImg = document.getElementById('logo');
                  // Verifique se há logos disponíveis em português
                  const logoPt = dadosLogo.logos.find(logo => logo.iso_639_1 === 'pt');
                  const logoEn = dadosLogo.logos.find(logo => logo.iso_639_1 === 'en');

                  if (logoPt) {
                      document.getElementById('movie-title').textContent = '';
                      logoImg.src = `https://image.tmdb.org/t/p/w500/${logoPt.file_path}`;
                      logoImg.alt = `Logo: ${tituloFilme}`
                  } else if (logoEn) {
                      // Se não encontrar uma logo em pt, exibir logo padrão (english)
                      document.getElementById('movie-title').textContent = '';
                      logoImg.src = `https://image.tmdb.org/t/p/w500/${logoEn.file_path}`
                      logoImg.alt = `Logo: ${tituloFilme}`
                  } else {
                      document.getElementById('movie-title').textContent = tituloFilme;
                      logoImg.style.display = 'none';
                      checkIfAllImagesLoaded(); //em uma situação que nao houver logo, carregar a página
                  }
                  logoImg.onload = function () {
                      checkIfAllImagesLoaded();
                  }
              })
              .catch(err => console.error(err));

          //Definição de variavéis 
          const tituloFilme = tipoMidia === 'movie' ? data.title : data.name; //verificação para qual dado recuperar, title (filmes) ou name (series)
          const likesFilme = data.vote_count; // Número de votos
          const viewsFilme = data.popularity; // Popularidade (visualizações)
          const notaFilme = data.vote_average; // Nota
          const duracaoFilme = tipoMidia === 'movie' ? data.runtime : data.number_of_seasons; // Tempo de duração em minutos ou nmr de temporadsa
          const generoFilme = data.genres && data.genres.length > 0 ? data.genres[0].name : 'N/A'; // Gênero principal
          const dataLancamento = (data.release_date || data.first_air_date)?.substring(0, 4) || 'N/A'; // Ano de lançamento
          const sinopseFilme = data.overview; // Sinopse
          const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/original/${data.poster_path}` : ''; //caminho do poster
          //let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='; //utliziando um server proxy para evitar problemas com crossorigin

          //Manipulação DOM para inserir elementos da API na tela
          const posterFilme = document.getElementById('movie-poster');
          image.setAttribute('crossOrigin', 'anonymous');
          posterFilme.src = posterPath;
          posterFilme.alt = `Poster: ${tituloFilme}`

          document.getElementById('movie-details-title').textContent = `${tituloFilme} - Popcorn Prose`; //Definiç~~ao title page de aordo com o nome do filme
          document.getElementById('views').textContent = formatNumber(viewsFilme);
          document.getElementById('likes').textContent = formatNumber(likesFilme);
          document.getElementById('sinopse').textContent = sinopseFilme;

          if (tipoMidia === 'movie') {
              document.getElementById('duration').textContent = `${duracaoFilme} min`;
          } else if (tipoMidia === 'tv') {
              if (tipoMidia === 'tv') {
                  document.getElementById('duration').textContent = `${duracaoFilme} temp.`;
              }
          } else {
              document.getElementById('duration').textContent = `Não definido`
          }

          document.getElementById('genre').textContent = generoFilme;
          document.getElementById('release-year').textContent = dataLancamento;
          document.getElementById('rating').textContent = notaFilme.toFixed(1);
      })
      .catch(error => {
          console.error('Erro ao carregar os detalhes do filme ou série:', error);
      });

  //BOTAO PARA ENVIAR REVIEW
  const btnEnviarReview = document.getElementById('btnEnviarReview');

  // Adicione um listener para o evento de clique no botão
  btnEnviarReview.addEventListener('click', function () {
      // Obtenha o conteúdo da textarea
      const reviewInput = document.getElementById('reviewInput');
      const conteudoReview = reviewInput.value;
      // Obtenha o número de estrelas selecionadas
      const estrelasSelecionadas = obterEstrelasSelecionadas();

      // Obtenha os dados do filme
      const reviewData = {
          idFilme: filmeId,
          reviewFilme: conteudoReview, // Use o conteúdo da textarea
          numEstrelas: estrelasSelecionadas,
          tipoMidia: tipoMidia,
          idUser: localStorage.getItem('id')
      };

      // Faça a requisição POST para o backend
      fetch('http://localhost:8080/review/addReview', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // Adicione outros headers conforme necessário, como um token de autenticação
          },
          body: JSON.stringify(reviewData)
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Erro ao cadastrar filme.');
              }
              return response.json();
          })
          .then(data => {
              console.log('Filme cadastrado com sucesso:', data);
              alert("Opinião registrada com sucesso!")
              location.reload();
              
          })
          .catch(error => {
              console.error('Erro ao cadastrar filme:', error.message);
              alert("Ocorreu um erro ao registrar sua opinião!")
          });
  });
}


const imagesToLoad = 2; // Defina o número total de imagens a serem carregadas
let loadedImages = 0;

//formatar numeros grandes
function formatNumber(number) {
    if (number < 1000) {
        return number.toString();
    } else if (number < 10000) {
        return (number / 1000).toFixed(1) + 'k';
    } else {
        return (number / 1000).toFixed(0) + 'k';
    }
}

function toggleListItem(item) {
  // Toggle da classe 'selected' para mudar a cor de fundo
  item.classList.toggle('selected');

  // Altere o texto de acordo com a presença da classe 'selected'
  const pElement = item.querySelector('#my-list');
  const iconElement = item.querySelector('i');
  if (item.classList.contains('selected')) {
    iconElement.classList.remove('fa-plus');
    iconElement.classList.add('fa-check');
    pElement.textContent = 'Na Minha Lista';
  } else {
    iconElement.classList.remove('fa-check');
    iconElement.classList.add('fa-plus');
    pElement.textContent = 'Minha Lista';
  }
}


const image = document.getElementById('movie-poster');
const colorThief = new ColorThief();

    image.onload = function() {
        const colors = colorThief.getPalette(image, 2); // Obter as duas cores predominantes da imagem
        const color1 = colors[0];
        const color2 = colors[1];
        const [R1, G1, B1] = color1;
        const [R2, G2, B2] = color2;
      
        const gradient = document.querySelector('.container-movie');
      
        // Verificar o tamanho da tela
        const isSmallScreen = window.innerWidth <= 768; // Defina a largura de tela que você considera "pequena"
      
        if (isSmallScreen) {
          // Aplicar gradiente a partir do topo em telas pequenas
          gradient.style.background = `linear-gradient(rgb(${R2}, ${G2}, ${B2}), rgb(${R1}, ${G1}, ${B1}), #1e1e1e 50%)`;
          console.log("tela pequena")
      } else {
          // Aplicar gradiente normalmente para telas maiores
          gradient.style.background = `radial-gradient(at top left, rgb(${R2}, ${G2}, ${B2}), rgb(${R1}, ${G1}, ${B1}), #1e1e1e 60%)`;
        }

        checkIfAllImagesLoaded();
    }
      
function checkIfAllImagesLoaded() { //function para administrar o loading das imagens para retirar o loading
    loadedImages++;
    if (loadedImages === imagesToLoad) {
      // Todas as imagens foram carregadas, agora podemos esconder o loader
        loadingBackground.setAttribute('aria-hidden', 'true');
        loadingIndicator.style.display = 'none';
    }
  }


  function executeRating(stars, existingReview) {
    const starClassActive = 'rating__star fas fa-star';
    const starClassInactive = 'rating__star far fa-star';

    stars.forEach((star, index) => {
        star.onclick = () => {
            if (!existingReview) {
                const selectedStars = stars.slice(0, index + 1);
                const unselectedStars = stars.slice(index + 1);

                selectedStars.forEach(selectedStar => {
                    selectedStar.className = starClassActive;
                });

                unselectedStars.forEach(unselectedStar => {
                    unselectedStar.className = starClassInactive;
                });
            }
        };
    });

    if (existingReview) {
      stars.forEach((star, index) => {
          if (index < existingReview.numEstrelas) {
              star.classList.remove('far');
              star.classList.add('fas');
          } else {
              star.onclick = null;
          }
          star.style.pointerEvents = 'none'; // Adiciona esta linha para desativar o clique
      });
    }
}



// Função para obter o número de estrelas selecionadas
function obterEstrelasSelecionadas() {
  const estrelas = document.getElementsByClassName("rating__star");
  let numEstrelas = 0;

  for (let i = 0; i < estrelas.length; i++) {
      if (estrelas[i].classList.contains("fas")) {
          numEstrelas++;
      }
  }

  return numEstrelas;
}

window.addEventListener('load', () => {
  montarPagina();
});

