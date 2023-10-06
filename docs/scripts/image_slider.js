export function iniciarSlides(apiKey, baseUrl, baseUrlLogo, tempoSlide, elemento, animacao) {
  const IMAGE_BASE_URL = baseUrl;
  const INTERVALO_SLIDE = tempoSlide;
  const LOGO_BASE_URL = baseUrlLogo;
  const elementoSlide = document.getElementById(elemento);
  let intervalo;


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
        elementoSlide.innerHTML = '';
  
        
        backdrops.forEach((image, index) => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');
          if (index === 0) {
            carouselItem.classList.add('active');
          }
  
          const img = document.createElement('img');
          img.classList.add('d-block', 'img-fluid');
          img.src = IMAGE_BASE_URL + image;
          img.alt = 'Slide Image';
  
          carouselItem.appendChild(img);
  
          if (animacao === 'slide' && logos[index]) {
            const logoImg = document.createElement('img');
            logoImg.classList.add('logo-image');
            logoImg.src = LOGO_BASE_URL + logos[index];
            logoImg.alt = 'Logo do Filme';
  
            carouselItem.appendChild(logoImg);
          }
  
          elementoSlide.appendChild(carouselItem);
        }); 
  }
  
  function mudarSlide() {
    const proximoIndice = (currentIndex + 1) % backdrops.length;
  
    if (currentIndex === 0) {
      // Para o primeiro slide, exibir imediatamente sem transição
      elementoSlide.style.transition = 'none';
      elementoSlide.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdrops[currentIndex]})`;
    } else {
      // A partir do segundo slide, aplicar transição
      if(animacao === 'fade'){
        elementoSlide.style.transition = 'opacity 0.5s ease-in-out';
        elementoSlide.style.opacity = 0;
      }
      
      
      setTimeout(() => {
        elementoSlide.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdrops[currentIndex]})`;
        elementoSlide.style.opacity = 1;
      }, 500);
    }
  
    currentIndex = proximoIndice;
  }
  
    // Limpar intervalos anteriores para evitar acumulação
    clearInterval(intervalo);
    elementoSlide.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdrops[currentIndex]})`;
    
    if (animacao === 'fade') {
        intervalo = setInterval(mudarSlide, INTERVALO_SLIDE);
    } else if (animacao === 'slide') {
        updateCarousel();
        intervalo = setInterval(mudarSlide, INTERVALO_SLIDE);
    }
    
  };
      
}