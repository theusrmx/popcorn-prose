function iniciarSlides(apiKey, baseUrl, baseUrlLogo, tempoSlide, elemento, animacao) {
  const IMAGE_BASE_URL = baseUrl;
  const INTERVALO_SLIDE = tempoSlide;
  const LOGO_BASE_URL = baseUrlLogo;
  const elementoSlide = document.getElementById(elemento);

  async function buscarFilmesSeriesPopulares() {
    try {
      const recuperarFilmes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
      const recuperarSeries = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);

      const dadosFilmes = await recuperarFilmes.json();
      const dadosSeries = await recuperarSeries.json();

      const filmeImagem = dadosFilmes.results.slice(0, 5).map(movie => movie.backdrop_path);
      const serieImagem = dadosSeries.results.slice(0, 5).map(series => series.backdrop_path);

      const idFilme = dadosFilmes.results.slice(0,5).map(movie => movie.id);
      const idSerie = dadosSeries.results.slice(0,5).map(series => series.id);

      console.log(idFilme, idSerie);

      const logosFilmes = [];
      const logosSeries = [];

    // Busca por logos dos filmes
    for (const id of idFilme) {
      const recuperarLogoFilmes = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`);
      const dadosLogoFilmes = await recuperarLogoFilmes.json();

      let logoPath = null;

      // Verifica se há logos em português
      const logoPt = dadosLogoFilmes.logos.find(logo => logo.iso_639_1 === 'pt');
      if (logoPt) {
        logoPath = logoPt.file_path;
      } else {
        // Se não houver em português, pega a primeira disponível em inglês
        const logoEn = dadosLogoFilmes.logos.find(logo => logo.iso_639_1 === 'en');
        if (logoEn) {
          logoPath = logoEn.file_path;
        }
      }

      if (logoPath) {
        logosFilmes.push(logoPath);
      }
    }

    // Busca por logos das séries
    for (const id of idSerie) {
      const recuperarLogoSeries = await fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${apiKey}`);
      const dadosLogoSeries = await recuperarLogoSeries.json();

      let logoPath = null;

      // Verifica se há logos em português
      const logoPt = dadosLogoSeries.logos.find(logo => logo.iso_639_1 === 'pt');
      if (logoPt) {
        logoPath = logoPt.file_path;
      } else {
        // Se não houver em português, pega a primeira disponível em inglês
        const logoEn = dadosLogoSeries.logos.find(logo => logo.iso_639_1 === 'en');
        if (logoEn) {
          logoPath = logoEn.file_path;
        }
      }

      if (logoPath) {
        logosSeries.push(logoPath);
      }
    }

      console.log('Logos dos filmes:', logosFilmes);
      console.log('Logos das séries:', logosSeries);

      return {filmeImagem, serieImagem, logosFilmes, logosSeries}
    } catch (error) {
      console.error('Erro ao recuperar imagens dos filmes e séries populares: ', error);
      return [];
    }
  }

  return async function updateSlide() {
    const { filmeImagem, serieImagem, logosFilmes, logosSeries } = await buscarFilmesSeriesPopulares();
    const backdrops = [...filmeImagem, ...serieImagem];
    const logos = [...logosFilmes, ...logosSeries];
    let currentIndex = 0;
  
    function updateCarousel() {
      // Limpar itens do carrossel
      elementoSlide.innerHTML = '';
  
      // Criar novo carrossel com os itens recuperados
      backdrops.forEach((image, index) => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');
          if (index === 0) {
              carouselItem.classList.add('active');
          }
  
          const img = document.createElement('img');
          img.classList.add('d-block', 'w-100');
          img.src = IMAGE_BASE_URL + image;
          img.alt = 'Slide Image';
  
          // Criar elemento de imagem para a logo
          const logoImg = document.createElement('img');
          logoImg.classList.add('logo-image');
          logoImg.src = LOGO_BASE_URL + logos[index];
          logoImg.alt = 'Logo do Filme';
  
          // Adicionar a imagem de fundo e a logo ao item do carrossel
          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container'); // Added a class for styling
          imageContainer.appendChild(img);
          imageContainer.appendChild(logoImg);
  
          carouselItem.appendChild(imageContainer);
          elementoSlide.appendChild(carouselItem);
      });
  }
  
    function mudarSlide() {
      currentIndex = (currentIndex + 1) % backdrops.length;
  
      // Aplicar transição suave para o efeito fade
      if (animacao === 'fade') {
        elementoSlide.style.transition = 'opacity 0.5s ease-in-out';
        elementoSlide.style.opacity = 0;
  
        setTimeout(() => {
          elementoSlide.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdrops[currentIndex]})`;
          elementoSlide.style.opacity = 1;
        }, 500);
      } else if (animacao === 'slide') {
        currentIndex = (currentIndex + 1) % backdrops.length;
        const items = elementoSlide.getElementsByClassName('carousel-item');
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove('active');
        }
        items[currentIndex].classList.add('active');
      }
    }
  
    // Limpar intervalos anteriores para evitar acumulação
    clearInterval(interval);
  
    if (animacao === 'fade') {
      // Intervalo para a transição dos slides
      interval = setInterval(mudarSlide, INTERVALO_SLIDE);
    } else if (animacao === 'slide') {
      updateCarousel();
  
      // Intervalo para avançar os slides
      interval = setInterval(avancarSlide, INTERVALO_SLIDE);
    }
  };
}

const API_KEY = '557439512040e55c35f758f339c8e1d1';
const BASE_URL = 'https://image.tmdb.org/t/p/original/';
const BASE_URL_LOGO = 'https://image.tmdb.org/t/p/original/';
let interval = 5000;

const slideShowLogin = iniciarSlides(API_KEY, BASE_URL, BASE_URL_LOGO, interval, 'backgroundSlide', 'fade');
const slideShowHome = iniciarSlides(API_KEY, BASE_URL, BASE_URL_LOGO, interval, 'carouselExampleSlidesOnly', 'slide');
slideShowLogin();
slideShowHome();
