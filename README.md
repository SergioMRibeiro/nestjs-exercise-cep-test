## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Autor

- [Sérgio Moreira Ribeiro](https://github.com/SergioMRibeiro/)

## Regras de negócio para resgatar um usuário

### Find one:
1. Caso o usuário não exista, retornar um erro 404 com a mensagem "User not found".
2. Caso o usuário exista, retornar o usuário com o endereço completo.
3. Tratar o CEP para remover caracteres especiais e garantir que seja um número (manter o dado como tipo string).

## Regras de negócio para criar um usuário

### Create:
1. Caso o CPF já exista, retornar um erro 400 com a mensagem "CPF already exists".
2. Caso o CPF não exista, criar o usuário e retornar o usuário criado.
3. Tratar o CPF e o CEP para remover caracteres especiais e garantir que sejam números (manter os dados como tipo string).
4. Antes de criar o usuário, chamar o método `getAddressByCep` para garantir que o CEP é válido.
5. Verificar se o CPF tem 11 caracteres e se o CEP tem 8 caracteres.

## Regras de negócio para resgatar todos os usuários

### Find all:
1. Retornar um array com todos os usuários.
2. Não fazer consultas de endereço para cada usuário.


