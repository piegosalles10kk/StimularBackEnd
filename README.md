
# Stimular Back-end

Aplicação back-end programada em node-js voltada para toda as necessidades do aplicativo Stimular.



## Documentação da API

### Rotas de Autenticação

#### Registrar um Usuário

```http
POST /auth/register
```

| Parâmetro | Tipo   | Descrição                                  |
| :-------- | :----- | :----------------------------------------- |
| `json`    | `json` | **Obrigatório**. Dados do novo usuário      |

**Exemplo de Payload**:

```json
{
  "email": "exemplo@dominio.com",
  "nome": "Nome do Usuário",
  "telefone": 123456789,
  "dataDeNascimento": "01/01/2000",
  "senha": "senhaSecreta",
  "confirmarSenha": "senhaSecreta",
  "tipoDeConta": "Tipo de Conta",
  "profissional": ["Profissional1", "Profissional2"]
}
```

#### Login de um Usuário

```http
POST /auth/login
```

| Parâmetro | Tipo   | Descrição                         |
| :-------- | :----- | :-------------------------------- |
| `json`    | `json` | **Obrigatório**. Dados de login    |

**Exemplo de Payload**:

```json
{
  "email": "exemplo@dominio.com",
  "senha": "senhaSecreta"
}
```

### Rotas de Usuário

#### Obter Detalhes de um Usuário

```http
GET /user/:id
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do usuário         |

#### Atualizar um Usuário

```http
PUT /user/:id
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do usuário         |
| `json`    | `json`   | **Obrigatório**. Dados atualizados       |

**Exemplo de Payload**:

```json
{
  "email": "novoEmail@dominio.com",
  "nome": "Novo Nome",
  "telefone": 987654321,
  "dataDeNascimento": "02/02/2000",
  "tipoDeConta": "Novo Tipo de Conta",
  "profissional": ["Novo Profissional1", "Novo Profissional2"]
}
```

#### Deletar um Usuário

```http
DELETE /user/:id
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do usuário         |

### Rotas para Atividades Criadas

#### Criar uma Atividade Criada

```http
POST /user/:id/atividadesCriadas
```

| Parâmetro | Tipo     | Descrição                              |
| :-------- | :------- | :------------------------------------- |
| `json`    | `json`   | **Obrigatório**. Dados da atividade    |

**Exemplo de Payload**:

```json
{
  "grupo": ["Grupo1", "Grupo2"],
  "titulo": "Título da Atividade",
  "descricao": "Descrição da Atividade",
  "icone": "Ícone da Atividade",
  "exercicios": [
    {
      "enunciado": "Enunciado do exercício 1",
      "questoes": [
        {"resposta": "Resposta A", "resultado": true},
        {"resposta": "Resposta B", "resultado": false}
      ]
    }
  ]
}
```

#### Obter Todas as Atividades Criadas

```http
GET /atividadesCriadas
```

| Parâmetro | Tipo | Descrição                 |
| :-------- | :--- | :------------------------ |
| `nenhum`  |      | Retorna todas as atividades |

#### Atualizar uma Atividade Criada

```http
PUT /atividadesCriadas/:id
```

| Parâmetro | Tipo     | Descrição                              |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID da atividade     |
| `json`    | `json`   | **Obrigatório**. Dados atualizados     |

**Exemplo de Payload**:

```json
{
  "grupo": ["Grupo1", "Grupo2"],
  "titulo": "Título Atualizado",
  "descricao": "Descrição Atualizada",
  "icone": "Ícone Atualizado",
  "exercicios": [
    {
      "enunciado": "Enunciado Atualizado",
      "questoes": [
        {"resposta": "Resposta Atualizada", "resultado": true}
      ]
    }
  ]
}
```

#### Deletar uma Atividade Criada

```http
DELETE /atividadesCriadas/:id
```

| Parâmetro | Tipo     | Descrição                     |
| :-------- | :------- | :---------------------------- |
| `id`      | `string` | **Obrigatório**. O ID da atividade. |

### Rotas para Atividade em Andamento

#### Criar uma Atividade em Andamento

```http
POST /user/:id/atividadeEmAndamento
```

| Parâmetro | Tipo     | Descrição                                  |
| :-------- | :------- | :----------------------------------------- |
| `json`    | `json`   | **Obrigatório**. Dados da atividade em andamento |

**Exemplo de Payload**:

```json
{
  "atividadeEmAndamento": {
    "id": 1,
    "idDaAtividade": 2,
    "respostasSalvas": [
      {"id": 1, "resposta": "1", "resultado": "Certo"}
    ],
    "pontuacaoSalva": 2,
    "dataInicio": "30/09/2024"
  }
}
```

#### Atualizar a Atividade em Andamento

```http
PUT /user/:id/atividadeEmAndamento
```

| Parâmetro | Tipo     | Descrição                                  |
| :-------- | :------- | :----------------------------------------- |
| `json`    | `json`   | **Obrigatório**. Dados atualizados da atividade |

**Exemplo de Payload**:

```json
{
  "atividadeEmAndamento": {
    "id": 1,
    "idDaAtividade": 2,
    "respostasSalvas": [
      {"id": 1, "resposta": "1", "resultado": "Certo"}
    ],
    "pontuacaoSalva": 3,
    "dataInicio": "01/10/2024"
  }
}
```

#### Deletar a Atividade em Andamento

```http
DELETE /user/:id/atividadeEmAndamento
```

| Parâmetro | Tipo | Descrição                                  |
| :-------- | :--- | :----------------------------------------- |

### Rotas para Atividade Finalizada

#### Criar uma Atividade Finalizada

```http
POST /user/:id/atividadeFinalizada
```

| Parâmetro | Tipo     | Descrição                                  |
| :-------- | :------- | :----------------------------------------- |
| `json`    | `json`   | **Obrigatório**. Dados da atividade finalizada |

**Exemplo de Payload**:

```json
{
  "atividadeFinalizada": {
    "idAtividade": "ID da Atividade",
    "dataInicio": "Data de Início",
    "dataFinalizada": "Data de Finalização",
    "pontuacao": 100
  }
}
```

#### Atualizar uma Atividade Finalizada

```http
PUT /user/:id/atividadeFinalizada/:atividadeId
```

| Parâmetro     | Tipo     | Descrição                                  |
| :------------ | :------- | :----------------------------------------- |
| `atividadeId` | `string` | **Obrigatório**. O ID da atividade         |
| `json`        | `json`   | **Obrigatório**. Dados atualizados         |

**Exemplo de Payload**:

```json
{
  "atividadeId": "ID da Atividade Finalizada",
  "idAtividade": "ID Atualizado",
  "dataInicio": "Data Atualizada",
  "dataFinalizada": "Data Atualizada",
  "pontuacao": 150
}
```

#### Deletar uma Atividade Finalizada

```http
DELETE /user/:id/atividadeFinalizada/:atividadeId
```

| Parâmetro     | Tipo     | Descrição                                  |
| :------------ | :------- | :----------------------------------------- |
| `atividadeId` | `string` | **Obrigatório**. O ID da atividade         |
## Autores

- [@piegosalles10kk](https://github.com/piegosalles10kk)

