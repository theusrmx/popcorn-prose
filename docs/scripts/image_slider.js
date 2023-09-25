function iniciarSlides(apiKey, baseUrl, tempoSlide, elemento, animacao) {
  const IMAGE_BASE_URL = baseUrl;
  const INTERVALO_SLIDE = tempoSlide;
  const elementoSlide = document.getElementById(elemento);

  async function fetchPopularMoviesAndSeries() {
    try {
      const recuperarFilmes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
      const recuperarSeries = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);

      const dadosFilmes = await recuperarFilmes.json();
      const dadosSeries = await recuperarSeries.json();

      const filmeImagem = dadosFilmes.results.slice(0, 5).map(movie => movie.backdrop_path);
      const serieImagem = dadosSeries.results.slice(0, 5).map(series => series.backdrop_path);

      return [...filmeImagem, ...serieImagem];
    } catch (error) {
      console.error('Erro ao recuperar imagens dos filmes e séries populares: ', error);
      return [];
    }
  }

  return async function updateSlide() {
    const backdrops = await fetchPopularMoviesAndSeries();
    let currentIndex = 0;
  
    function updateCarousel() {
      // Clear existing items in the carousel
      elementoSlide.innerHTML = '';
  
      // Create new carousel items with images
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
  
        carouselItem.appendChild(img);
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
let interval = 5000;

const slideShowLogin = iniciarSlides(API_KEY, BASE_URL, interval, 'backgroundSlide', 'fade');
const slideShowHome = iniciarSlides(API_KEY, BASE_URL, interval, 'carouselExampleSlidesOnly', 'slide');
slideShowLogin();
slideShowHome();
