//const myAPIUrl = "http://localhost:8080";
const myAPIUrl = "https://9722p18b-8080.brs.devtunnels.ms";


//Realizar cadastro
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os dados do formulário
    var formData = new FormData(event.target);

    // Cria um objeto com os dados do formulário
    const novoUsuario = {
        nome: formData.get('nome'),
        sobrenome: formData.get('sobrenome'),
        dataNascimento: formData.get('data_nascimento'),
        email: formData.get('email'),
        senha: formData.get('senha'),
        genero: formData.get('genero'),
        nacionalidade: formData.get('nacionalidade')
    };

    // Faz a solicitação fetch
    fetch(myAPIUrl + '/auth/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar. Por favor, tente novamente.');
        }
        return response.text();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert("Cadastro realizado com sucesso, faça o login para continuar.")
        window.location.href = 'login.html';
    })
    .catch(error => {
        console.error('Erro durante o cadastro:', error.message);
        alert("Erro durante o cadastro");
    });
});