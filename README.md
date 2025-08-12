# API Stimular - Documentação de Rotas

Esta documentação descreve todas as rotas disponíveis na API Stimular, incluindo seus métodos, parâmetros e autenticação necessária.

## 🔐 Autenticação

A maioria das rotas requer autenticação via token JWT. O token deve ser enviado no header da requisição:
```
Authorization: Bearer {token}
```

## 👤 Usuários (User Routes)

### Autenticação

#### `POST /auth/register`
**Descrição:** Registra um novo usuário  
**Autenticação:** ❌ Não requerida  
**Body:** 
```json
{
  "email": "string",
  "nome": "string", 
  "telefone": "string",
  "dataDeNascimento": "string",
  "senha": "string",
  "confirmarSenha": "string",
  "tipoDeConta": "string", // Admin, Profissional, Paciente
  "moeda": {
    "valor": "string",
    "dataDeCriacao": "string"
  },
  "foto": "string",
  "ativo": boolean
}
```

#### `POST /auth/login`
**Descrição:** Realiza login do usuário  
**Autenticação:** ❌ Não requerida  
**Body:** 
```json
{
  "email": "string",
  "senha": "string"
}
```

#### `GET /auth/:email`
**Descrição:** Verifica se email está cadastrado  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** `email` (string)

#### `PUT /auth/update-password-recovery`
**Descrição:** Atualiza senha via recuperação  
**Autenticação:** ❌ Não requerida  
**Body:** 
```json
{
  "email": "string",
  "codigoRecuperarSenha": "string", 
  "senha": "string",
  "confirmarSenha": "string"
}
```

#### `PUT /auth/update-password/:id`
**Descrição:** Atualiza senha do usuário logado  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)  
**Body:** 
```json
{
  "senhaAtual": "string",
  "senhaNova": "string", 
  "confirmarSenhaNova": "string"
}
```

### Gerenciamento de Usuários

#### `GET /user`
**Descrição:** Lista todos os usuários  
**Autenticação:** ✅ Requerida

#### `GET /user-ativos`
**Descrição:** Lista apenas usuários ativos  
**Autenticação:** ✅ Requerida

#### `GET /user-ativos-paciente`
**Descrição:** Lista pacientes ativos vinculados ao profissional logado  
**Autenticação:** ✅ Requerida (Profissional)

#### `GET /user/:id`
**Descrição:** Busca usuário específico por ID  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)

#### `PUT /user/:id`
**Descrição:** Atualiza dados do usuário  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)  
**Body:** Dados a serem atualizados

#### `DELETE /user/:id`
**Descrição:** Remove usuário  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)

#### `PUT /usuario/status/:id`
**Descrição:** Ativa/desativa usuário  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)  
**Body:** 
```json
{
  "motivo": "string"
}
```

#### `PATCH /users/:id/moeda`
**Descrição:** Atualiza moedas do usuário  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId do usuário)  
**Body:** 
```json
{
  "moeda": {
    "valor": "string",
    "dataDeCriacao": "string"
  }
}
```

### Validade e Assinatura

#### `POST /validade`
**Descrição:** Webhook para atualizar validade via RevenueCat  
**Autenticação:** ❌ Não requerida  
**Body:** Payload do RevenueCat

#### `GET /demo/:id/:dias`
**Descrição:** Atualiza validade demo do usuário  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `id` (ObjectId do usuário)
- `dias` (número de dias)

## 📧 Email (Send Email Routes)

#### `GET /auth/recover/:email`
**Descrição:** Envia email de recuperação de senha  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** `email` (string)

#### `GET /auth/verify-code/:email/:codigo`
**Descrição:** Verifica código de recuperação  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** 
- `email` (string)
- `codigo` (string)

## 🎯 Atividades App (Atividade App Routes)

#### `POST /atividadeApp`
**Descrição:** Cria nova atividade standalone  
**Autenticação:** ✅ Requerida  
**Body:** 
```json
{
  "idade": number,
  "marco": "string",
  "nomdeDaAtividade": "string",
  "descicaoDaAtividade": "string",
  "fotoDaAtividade": "string",
  "tipoDeAtividade": "string",
  "exercicios": [...]
}
```

#### `GET /atividadeApp`
**Descrição:** Lista todas as atividades standalone  
**Autenticação:** ✅ Requerida

#### `GET /atividadeApp/:atividadeId`
**Descrição:** Busca atividade específica  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `atividadeId` (ObjectId)

#### `PUT /atividadeApp/:atividadeId`
**Descrição:** Atualiza atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `atividadeId` (ObjectId)  
**Body:** Dados a serem atualizados

#### `DELETE /atividadeApp/:atividadeId`
**Descrição:** Remove atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `atividadeId` (ObjectId)

## 🎮 Grupos de Atividades (Grupo Atividades Routes)

#### `POST /grupoatividades`
**Descrição:** Cria novo grupo de atividades manualmente  
**Autenticação:** ✅ Requerida  
**Body:** 
```json
{
  "nomeGrupo": "string",
  "nivelDaAtividade": number,
  "imagem": "string",
  "dominio": ["string"],
  "descricao": "string",
  "atividades": [...],
  "identificador": "string"
}
```

#### `POST /grupoatividadesAuto`
**Descrição:** Cria grupo de atividades automaticamente baseado no perfil do paciente  
**Autenticação:** ✅ Requerida (Paciente)

#### `GET /grupoatividadesAuto`
**Descrição:** Lista grupos de atividades criados automaticamente pelo usuário  
**Autenticação:** ✅ Requerida

#### `GET /grupoatividades`
**Descrição:** Lista grupos com filtros (query params)  
**Autenticação:** ❌ Não requerida  
**Query Params:** `criadorId`, `dominio`

#### `GET /grupoatividades/:id`
**Descrição:** Busca grupo específico  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `PUT /grupoatividades/:id`
**Descrição:** Atualiza grupo completo  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `PATCH /grupoatividades/:id`
**Descrição:** Atualiza campos específicos do grupo  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `DELETE /grupoatividades/:id`
**Descrição:** Remove grupo  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `GET /grupos-atividades/nivel`
**Descrição:** Filtra grupos por nível e outros critérios  
**Autenticação:** ✅ Requerida  
**Query Params:** 
- `nivel` (number)
- `grupo` (array de strings)
- `tipoDeAtividades` (string)

#### `PATCH /atividades/:atividadeId/exercicios`
**Descrição:** Adiciona exercício a uma atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `atividadeId` (ObjectId)

## 🏃 Atividades (Atividade Routes)

#### `POST /grupoatividades/:grupoAtividadeId/atividades`
**Descrição:** Cria atividade dentro de um grupo  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `grupoAtividadeId` (ObjectId)

#### `GET /atividades/:idGrupoAtividades/:idAtividade`
**Descrição:** Busca atividade específica dentro de um grupo  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `idGrupoAtividades` (ObjectId)
- `idAtividade` (ObjectId)

#### `PATCH /atividades/:id`
**Descrição:** Atualiza atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `DELETE /atividades/:id`
**Descrição:** Remove atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

## ⏳ Atividades Em Andamento (Atividade Em Andamento Routes)

#### `POST /grupoatividades/:grupoAtividadeId/atividadesemandamento`
**Descrição:** Inicia uma atividade (coloca em andamento)  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `grupoAtividadeId` (ObjectId)  
**Body:** 
```json
{
  "respostas": [...]
}
```

#### `GET /atividadesemandamento/:id`
**Descrição:** Busca atividade em andamento  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `PATCH /atividadesemandamento/:id`
**Descrição:** Atualiza atividade em andamento  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)  
**Body:** 
```json
{
  "novasRespostas": [...]
}
```

#### `PATCH /grupos/:grupoId/respostas`
**Descrição:** Atualiza resposta específica de um exercício  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `grupoId` (ObjectId)  
**Body:** 
```json
{
  "atividade_id": "ObjectId",
  "exercicioId": "ObjectId", 
  "alternativaId": "ObjectId",
  "isCorreta": boolean,
  "pontuacao": number,
  "pontuacaoPossivel": number,
  "tipoAtividade": "string"
}
```

#### `DELETE /atividadesemandamento/:id`
**Descrição:** Remove atividade em andamento  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

## ✅ Atividades Finalizadas (Atividade Finalizada Routes)

#### `POST /grupoatividades/:grupoAtividadeId/atividadesfinalizadas`
**Descrição:** Finaliza uma atividade em andamento  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `grupoAtividadeId` (ObjectId)

#### `GET /atividadesfinalizadas/:id`
**Descrição:** Busca atividade finalizada  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `PATCH /atividadesfinalizadas/:id`
**Descrição:** Atualiza atividade finalizada  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `id` (ObjectId)

#### `DELETE /atividadesfinalizadas/:grupoAtividadesId`
**Descrição:** Remove atividade finalizada  
**Autenticação:** ✅ Requerida  
**Parâmetros:** `grupoAtividadesId` (ObjectId)

## 📝 Exercícios (Exercicios Routes)

#### `PATCH /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios`
**Descrição:** Adiciona exercício a uma atividade  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `grupoAtividadeId` (ObjectId)
- `atividadeId` (ObjectId)

#### `GET /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId`
**Descrição:** Busca exercício específico  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `grupoAtividadeId` (ObjectId)
- `atividadeId` (ObjectId)
- `exercicioId` (ObjectId)

#### `PATCH /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId`
**Descrição:** Atualiza exercício  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `grupoAtividadeId` (ObjectId)
- `atividadeId` (ObjectId)
- `exercicioId` (ObjectId)

#### `DELETE /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId`
**Descrição:** Remove exercício  
**Autenticação:** ✅ Requerida  
**Parâmetros:** 
- `grupoAtividadeId` (ObjectId)
- `atividadeId` (ObjectId)
- `exercicioId` (ObjectId)

## 📱 Mural (Mural Routes)

#### `POST /mural`
**Descrição:** Cria/atualiza mural (remove todos os anteriores)  
**Autenticação:** ✅ Requerida  
**Body:** 
```json
{
  "titulo": "string",
  "conteudo": "string", 
  "autor": "string"
}
```
**Nota:** Também aceita arquivo de mídia via multipart/form-data

#### `GET /mural`
**Descrição:** Lista murais  
**Autenticação:** ✅ Requerida

## 🔄 Atualizações (Atualizacoes Routes)

#### `POST /atualizacoes`
**Descrição:** Cria nova atualização do app  
**Autenticação:** ❌ Não requerida  
**Body:** 
```json
{
  "tituloAtualizacao": "string",
  "descricaoAtualizacao": "string",
  "tarefas": [
    {
      "tituliDaTarefa": "string",
      "descricaoTarefa": "string", 
      "tipoDeTarefa": "string"
    }
  ]
}
```

#### `GET /atualizacoes`
**Descrição:** Lista todas as atualizações  
**Autenticação:** ❌ Não requerida

#### `PUT /atualizacoes/:id`
**Descrição:** Edita atualização  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** `id` (ObjectId)

#### `DELETE /atualizacoes/:id`
**Descrição:** Remove atualização  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** `id` (ObjectId)

## 📊 Dados App (Dados App Routes)

#### `POST /dadosApp`
**Descrição:** Gera e salva dados estatísticos do app  
**Autenticação:** ❌ Não requerida

#### `GET /dadosApp`
**Descrição:** Busca dados estatísticos  
**Autenticação:** ✅ Requerida

## 📁 Upload de Mídia (Upload Midia Routes)

#### `POST /midia/post/:id`
**Descrição:** Faz upload de mídia (imagem/vídeo)  
**Autenticação:** ❌ Não requerida  
**Parâmetros:** `id` (identificador único)  
**Body:** Arquivo via multipart/form-data ou base64 via JSON

## 📋 Estrutura dos Principais Models

### User
- `tipoDeConta`: "Admin", "Profissional", "Paciente"
- `nome`, `email`, `telefone`, `dataDeNascimento`
- `foto`, `senha`, `ativo`
- `validade`: data de expiração da assinatura
- `moeda`: sistema de moedas do usuário
- `nivel`: nível do paciente
- `erros`: categorias com dificuldades (socializacao, cognicao, linguagem, autoCuidado, motor)
- `gruposDeAtividadesEmAndamento`: atividades que o usuário está fazendo
- `gruposDeAtividadesFinalizadas`: atividades completadas pelo usuário

### GrupoAtividades
- `nomeGrupo`, `descricao`, `imagem`
- `nivelDaAtividade`: dificuldade
- `dominio`: categorias (TEA, etc.)
- `atividades`: array de atividades
- `pontuacaoTotalDoGrupo`: soma de todos os pontos possíveis

### Atividades
- `nomdeDaAtividade`, `descicaoDaAtividade`
- `idade`, `marco`: marco de desenvolvimento
- `tipoDeAtividade`: categoria da atividade
- `exercicios`: array de exercícios

### Exercicios
- `enunciado`, `exercicio`: pergunta e contexto
- `alternativas`: opções de resposta
- `pontuacao`: pontos que vale o exercício
- `midia`: imagem/vídeo opcional

---

## 📌 Notas Importantes

1. **Tokens JWT**: Incluem `id`, `tipoDeConta`, `nivel`, `grupo`, `ativo` e `validade`
2. **Atividades Automáticas**: Criadas com base no campo `erros` do paciente
3. **Sistema de Pontuação**: Calculado automaticamente com base nos exercícios
4. **Validação de Assinatura**: Verificada automaticamente nas rotas protegidas
5. **Upload de Mídia**: Armazenado no Azure Blob Storage
6. **Recuperação de Senha**: Via email com código de 6 caracteres
