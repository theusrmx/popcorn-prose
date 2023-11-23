// navbar.js
document.addEventListener('DOMContentLoaded', function() {
    gerenciarEstadoLogin();
});

function gerenciarEstadoLogin() {
    const token = localStorage.getItem('token');

    if (token) {
        // Usuário está logado
        ocultarElemento('.navbar-nav .nav-link[href="login.html"]');
        adicionarLinksLoggedIn();
    } else {
        // Usuário não está logado
        ocultarElemento('.navbar-nav .nav-link[href="user.html"]');
        ocultarElemento('.navbar-nav .nav-link[href="#"]');
    }
}

function ocultarElemento(selector) {
    const element = document.querySelector(selector);

    if (element) {
        element.parentElement.style.display = 'none';
    }
}

function adicionarLinksLoggedIn() {
    const navbarNav = document.querySelector('.navbar-nav');

    if (navbarNav) {
        const linkMeusFilmes = criarLink('user.html', 'Meus Filmes');
        const linkDeslogar = criarLink('#', 'Sair', deslogar);

        // Adiciona estilo ao linkDeslogar
        linkDeslogar.style.backgroundColor = '#d83333';
        linkDeslogar.style.color = '#000';
        linkDeslogar.style.borderRadius = '20px';


        navbarNav.appendChild(linkMeusFilmes);
        navbarNav.appendChild(linkDeslogar);
    }
}

function criarLink(href, text, clickHandler) {
    const link = document.createElement('a');
    link.href = href;
    link.classList.add('nav-link');
    link.textContent = text;

    if (clickHandler) {
        link.addEventListener('click', clickHandler);
    }

    return link;
}

function deslogar() {
    // Lógica para deslogar o usuário
    // Remover o token e redirecionar para a página de login, por exemplo
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('surname');
    localStorage.removeItem('nmrFilmes');
    localStorage.removeItem('nmrSeries');


    window.location.href = 'login.html';
}
