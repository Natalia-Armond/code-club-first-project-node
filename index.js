const express = require("express"); // Importa o framework Express
const uuid = require("uuid"); // Importa o pacote uuid para gerar IDs únicos
const port = 3001; // Define a porta em que o servidor irá escutar
const app = express(); // Cria uma instância do aplicativo Express
app.use(express.json()); // Habilita o uso de JSON para análise do corpo da requisição

/*
    - Query params => meuSite.com/users?name=natalia&age=37 // FILTROS
    - Route params => /users/2  // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
*/

const users = [];

// Middleware para verificar se um usuário com um determinado ID existe
const checkUserId = (request, response, next) => {
  const { id } = request.params; // Obtém o ID do usuário a ser atualizado dos parâmetros da rota
  const index = users.findIndex((user) => user.id === id); // Encontra o índice do usuário a ser atualizado no array de usuários

  // Verifica se o usuário foi encontrado
  if (index < 0) {
    return response.status(404).json({ error: "User not found" }); // Retorna um erro 404 (Não encontrado) se o usuário não existir
  }

  // Adiciona as informações do usuário e seu índice à requisição para uso posterior
  request.userIndex = index;
  request.userId = id;

  next(); // Chama o próximo middleware ou rota
};

// Rota para obter todos os usuários
app.get("/users", (request, response) => {
  // Retorna todos os usuários em formato JSON
  return response.json({ users });
});

// Rota para criar um novo usuário
app.post("/users", (request, response) => {
  const { name, age } = request.body; // Extrai o nome e a idade do corpo da requisição
  const user = { id: uuid.v4(), name, age }; // Cria um novo usuário com um ID único usando o pacote uuid
  users.push(user); // Adiciona o novo usuário ao array de usuários
  return response.status(201).json({ users }); // Retorna o status 201 (Criado) e o array atualizado de usuários em formato JSON
});

// Rota para atualizar um usuário existente
app.put("/users/:id", checkUserId, (request, response) => {
  const { name, age } = request.body; // Extrai o novo nome e idade do corpo da requisição
  const index = request.userIndex;
  const id = request.userId;

  const updatedUser = { id, name, age }; // Cria um objeto representando o usuário atualizado
  users[index] = updatedUser; // Atualiza o usuário no array de usuários

  return response.json({ updatedUser }); // Retorna o usuário atualizado em formato JSON
});

// Define uma rota para deletar um usuário com base no ID
app.delete("/users/:id", checkUserId, (request, response) => {
  const index = request.userIndex;
  users.splice(index, 1); // Remove o usuário do array de usuários
  return response.status(204).json(); // Retorna uma resposta de sucesso
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`🚀Server started on port ${port}`);
});
