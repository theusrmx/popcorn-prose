const API_KEY = '557439512040e55c35f758f339c8e1d1';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original/';
const SLIDE_INTERVAL = 5000;

const backgroundSlide = document.getElementById('backgroundSlide');
async function fetchPopularMoviesAndSeries() {
    try {
      const responseMovies = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
      const responseSeries = await fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`);
  
      const movieData = await responseMovies.json();
      const seriesData = await responseSeries.json();
  
      const movieBackdrops = movieData.results.slice(0, 3).map(movie => movie.backdrop_path);
      const seriesBackdrops = seriesData.results.slice(0, 3).map(series => series.backdrop_path);
  
      return [...movieBackdrops, ...seriesBackdrops];
    } catch (error) {
      console.error('Error fetching popular movies and series:', error);
      return [];
    }
  }
  
  async function updateBackgroundSlide() {
    const backdrops = await fetchPopularMoviesAndSeries();
    let currentIndex = 0;
  
    function changeSlide() {
      backgroundSlide.style.backgroundImage = `url(${IMAGE_BASE_URL}${backdrops[currentIndex]})`;
      currentIndex = (currentIndex + 1) % backdrops.length;
    }
  
    changeSlide();
    setInterval(changeSlide, SLIDE_INTERVAL);
  }
  
  updateBackgroundSlide();