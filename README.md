# Desafio Bradial

[![Stack](https://skillicons.dev/icons?i=nextjs,nestjs,postgresql,kafka,docker&theme=light)](https://skillicons.dev)

## 📝 Descrição

Desafio da Bradial para desenvolver um sistema para gestão de estoque de produtos.

## ⚙️ Funcionalidades

- **Listar todos os produtos**
  - Exibir uma lista paginada de todos os produtos disponíveis no estoque.
  - Permitir a busca de produtos por nome ou código.
- **Cadastrar um novo produto**
  - Formulário para inserir detalhes do produto (nome, descrição e alerta de limite).
  - Validação dos dados do produto antes do cadastro.
  - Feedback de resposta ao usuário.
- **Editar um produto existente**
  - Formulário para atualizar os detalhes de um produto.
  - Validação dos dados atualizados antes de salvar.
  - Feedback de resposta ao usuário.
- **Inativar um produto**
  - Permitir a inativação de produtos do estoque, em vez de deletá-los.
  - Solicitar confirmação do usuário antes de inativar.
  - Feedback de resposta ao usuário.
- **Visualizar detalhes de um produto**
  - Página dedicada para exibir informações detalhadas sobre um produto específico.
- **Registrar entrada e saída de produtos**
  - Formulário para registrar a entrada de novos produtos no estoque.
  - Formulário para registrar a saída de produtos do estoque.
  - Exibir um histórico de entradas e saídas de cada produto.
- **Alerta de Limite**
  - Caso o registro de saída do produto viole o alerta de limite, será enviado um email ao gerente do estoque.
