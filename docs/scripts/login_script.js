document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    const loginData = {
        email: formData.get('login'),
        senha: formData.get('senha')
    }

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao entrar. Por favor, tente novamente.');
        }
        return response.text();
    })
    .then(token => {
        console.log('Token recebido do servidor:', token);
        // Armazenar o token no localStorage
        localStorage.setItem('token', token);
        getName(token);
        // Redirecionar para a página principal
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erro ao entrar:', error.message);
        alert("Erro ao entrar.");
    });
});


// Função para obter o nome do usuário do servidor
async function getName(token) {
    try {
        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return;
        }

        const response = await fetch('http://localhost:8080/auth/get-name', {
            method: 'GET'
        });

        if (!response.ok) {
            console.error('Erro ao obter o nome do usuário');
            return;
        }

        const name = await response.text();
        console.log('Nome do usuário:', name);
        // Armazenar o nome no localStorage
        localStorage.setItem('name', name);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

