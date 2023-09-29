import { iniciarSlides } from "./image_slider.js";

const API_KEY = '557439512040e55c35f758f339c8e1d1';
const BASE_URL = 'https://image.tmdb.org/t/p/original/';
const BASE_URL_LOGO = 'https://image.tmdb.org/t/p/original/';
let interval = 5000;


const slideShowLogin = iniciarSlides(API_KEY, BASE_URL, BASE_URL_LOGO, interval, 'backgroundSlide', 'fade');
const slideShowLoginMin = iniciarSlides(API_KEY, BASE_URL, BASE_URL_LOGO, interval, 'imagem', 'fade');
slideShowLogin();
slideShowLoginMin();
