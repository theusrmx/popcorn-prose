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
        getID(token);
        getSurname(token);      
        // Redirecionar para a página principal
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erro ao entrar:', error.message);
        alert("Erro ao entrar.");
    });
});

// Função para obter o nome do usuário do servidor
function getName(token) {
    try {
        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return Promise.reject(new Error('O usuário não está autenticado.'));
        }

        return fetch('http://localhost:8080/auth/get-name', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error('Erro ao obter o nome do usuário');
                return Promise.reject(new Error('Erro ao obter o nome do usuário'));
            }
            return response.text();
        })
        .then(name => {
            console.log('Nome do usuário:', name);
            // Armazenar o nome no localStorage
            localStorage.setItem('name', name);
            return name;
        })
        .catch(error => {
            console.error('Erro:', error.message);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error('Erro:', error.message);
        return Promise.reject(error);
    }
}

// Função para obter o sobrenome do usuário do servidor
function getSurname(token) {
    try {
        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return Promise.reject(new Error('O usuário não está autenticado.'));
        }

        return fetch('http://localhost:8080/auth/get-surname', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error('Erro ao obter o nome do usuário');
                return Promise.reject(new Error('Erro ao obter o nome do usuário'));
            }
            return response.text();
        })
        .then(surname => {
            console.log('Nome do usuário:', surname);
            // Armazenar o nome no localStorage
            localStorage.setItem('surname', surname);
            return surname;
        })
        .catch(error => {
            console.error('Erro:', error.message);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error('Erro:', error.message);
        return Promise.reject(error);
    }
}

// Função para obter o id do usuario do servidor
function getID(token) {
    try {
        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return Promise.reject(new Error('O usuário não está autenticado.'));
        }

        return fetch('http://localhost:8080/auth/get-id', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Erro ao obter o ID do usuário: ${response.status}`);
                return Promise.reject(new Error(`Erro ao obter o ID do usuário: ${response.status}`));
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // Se o tipo de conteúdo for JSON, provavelmente é o ID
                return response.json();
            } else {
                // Se não for JSON, trata como uma mensagem de texto
                return response.text();
            }
        })
        .then(data => {
            console.log('ID do usuário:', data);
            localStorage.setItem('id', data);
            return data;
        })
        .catch(error => {
            console.error('Erro:', error.message);
            return Promise.reject(error);
        });
    } catch (error) {
        console.error('Erro:', error.message);
        return Promise.reject(error);
    }
}


