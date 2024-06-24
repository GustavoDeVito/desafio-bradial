## Readme

# Desafio Bradial

[![Stack](https://skillicons.dev/icons?i=nextjs,nestjs,postgresql,kafka,docker&theme=light)](https://skillicons.dev)

## 📝 Descrição

Desafio da Bradial para desenvolver um sistema para gestão de estoque de produtos.

## ⚙️ Funcionalidades

- **Listar todos os produtos**
  - Exibir uma lista paginada de todos os produtos disponíveis no estoque.
  - Permitir a busca de produtos por nome ou código.
- **Cadastrar um novo produto**
  - Formulário para inserir detalhes do produto (nome e descrição).
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

## 📋 Pré-requisitos

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

2. Crie um arquivo chamado `stack.env` no diretório raiz do projeto com as seguintes variáveis de ambiente:

    ```env
    DATABASE_URL=
    MAILER_HOST=
    MAILER_PORT=
    MAILER_USER=
    MAILER_PASS=
    BROKER_HOST=
    NEXT_PUBLIC_API=
    ```

3. Crie uma conta no [Mailtrap](https://mailtrap.io/) para usar o sistema de email. Insira as credenciais fornecidas pelo Mailtrap nas variáveis `MAILER_HOST`, `MAILER_PORT`, `MAILER_USER` e `MAILER_PASS` no arquivo `stack.env`.

4. Use o `docker-compose` para rodar o projeto. No terminal, navegue até o diretório onde o `docker-compose.yml` está localizado e execute o comando:

```sh
    docker-compose up --build
```
