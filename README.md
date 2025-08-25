# API StimuLar - Backend

## 📋 Descrição do Projeto

A **API StimuLar** é o backend do aplicativo StimuLar, desenvolvido para auxiliar famílias atípicas na estimulação de seus filhos. A API implementa princípios baseados na Terapia ABA (Applied Behavior Analysis) e fornece endpoints para gerenciamento de usuários, atividades, exercícios e acompanhamento de progresso.

> ⚠️ **Importante**: Esta API não substitui consultas com profissionais de saúde. O uso deve ser acompanhado por profissionais especializados.

## 🏗️ Arquitetura do Sistema

### 📂 Estrutura de Pastas

```
src/
├── 🎮 controllers/           # Lógica de negócio dos endpoints
│   ├── atividadeAppController.js      # Atividades standalone
│   ├── atividadeController.js         # Atividades em grupos
│   ├── atividadeEmAndamentoController.js  # Controle de progresso
│   ├── atividadeFinalizadaController.js   # Atividades completadas
│   ├── atualizacoesController.js      # Atualizações do app
│   ├── dadosAppController.js          # Estatísticas da aplicação
│   ├── exercicioController.js         # Exercícios individuais
│   ├── grupoAtividadesController.js   # Grupos de atividades
│   └── userController.js              # Gerenciamento de usuários
├── 🛡️ middleware/             # Middlewares de autenticação
│   └── checkToken.js                  # Validação JWT
├── 📊 models/                # Modelos de dados (MongoDB)
│   └── User.js                        # Schemas principais
└── 🛣️ routes/                 # Definição das rotas
    ├── atividadeAppRoutes.js          # Rotas de atividades standalone
    ├── atividadeEmAndamentoRoutes.js  # Rotas de atividades em progresso
    ├── atividadeFinalizadaRoutes.js   # Rotas de atividades finalizadas
    ├── atividadeRoutes.js             # Rotas de atividades em grupos
    ├── atualizacoesRoutes.js          # Rotas de atualizações
    ├── dadosAppRoutes.js              # Rotas de estatísticas
    ├── exerciciosRoutes.js            # Rotas de exercícios
    ├── grupoAtividadesRoutes.js       # Rotas de grupos
    ├── uploadMidiaRoutes.js           # Upload de arquivos
    └── userRoutes.js                  # Rotas de usuários
```

## 🔐 Sistema de Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. O token deve ser enviado no header das requisições protegidas:

```
Authorization: Bearer {token}
```

### Estrutura do Token JWT
```json
{
  "id": "ObjectId do usuário",
  "tipoDeConta": "Admin|Profissional|Paciente",
  "nivel": "número do nível",
  "grupo": ["array de grupos"],
  "ativo": "boolean",
  "validade": "data de expiração"
}
```

## 👥 Tipos de Usuário

### 1. **Paciente**
- Acesso às atividades personalizadas
- Visualização do progresso
- Sistema de moedas e conquistas
- Criação automática de grupos de atividades

### 2. **Profissional**
- Acompanhamento de múltiplos pacientes
- Visualização de dados e estatísticas
- Gestão de informações profissionais
- Criação manual de atividades

### 3. **Admin**
- Controle total do sistema
- Gestão de usuários e atividades
- Relatórios e análises
- Administração de conteúdo

## 📡 Rotas da API

### 🔐 Autenticação e Usuários (`/user`, `/auth`)

#### **Autenticação**
```javascript
POST /auth/register          // ❌ Registra novo usuário
POST /auth/login            // ❌ Realiza login
GET /auth/:email           // ❌ Verifica se email existe
PUT /auth/update-password-recovery  // ❌ Atualiza senha via recuperação
PUT /auth/update-password/:id       // ✅ Atualiza senha do usuário logado
```

#### **Gerenciamento de Usuários**
```javascript
GET /user                   // ✅ Lista todos os usuários
GET /user-ativos           // ✅ Lista usuários ativos
GET /user-ativos-paciente  // ✅ Lista pacientes do profissional logado
GET /user/:id              // ✅ Busca usuário específico
PUT /user/:id              // ✅ Atualiza dados do usuário
DELETE /user/:id           // ✅ Remove usuário
PUT /usuario/status/:id    // ✅ Ativa/desativa usuário
PATCH /users/:id/moeda     // ✅ Atualiza moedas do usuário
```

#### **Assinatura e Validade**
```javascript
POST /validade             // ❌ Webhook RevenueCat
GET /demo/:id/:dias        // ✅ Atualiza validade demo
```

### 🎯 Atividades Standalone (`/atividadeApp`)

```javascript
POST /atividadeApp                    // ✅ Cria nova atividade
GET /atividadeApp                     // ✅ Lista todas as atividades
GET /atividadeApp/:atividadeId        // ✅ Busca atividade específica
PUT /atividadeApp/:atividadeId        // ✅ Atualiza atividade
DELETE /atividadeApp/:atividadeId     // ✅ Remove atividade
```

### 🎮 Grupos de Atividades (`/grupoatividades`)

```javascript
POST /grupoatividades                 // ✅ Cria grupo manualmente
POST /grupoatividadesAuto            // ✅ Cria grupo automaticamente (Pacientes)
GET /grupoatividadesAuto             // ✅ Lista grupos criados pelo usuário
GET /grupoatividades                 // ❌ Lista grupos com filtros
GET /grupoatividades/:id             // ✅ Busca grupo específico
PUT /grupoatividades/:id             // ✅ Atualiza grupo completo
PATCH /grupoatividades/:id           // ✅ Atualiza campos específicos
DELETE /grupoatividades/:id          // ✅ Remove grupo
GET /grupos-atividades/nivel         // ✅ Filtra por nível e critérios
```

### 🏃 Atividades em Grupos (`/atividades`)

```javascript
POST /grupoatividades/:grupoAtividadeId/atividades  // ✅ Cria atividade no grupo
GET /atividades/:idGrupoAtividades/:idAtividade     // ✅ Busca atividade específica
PATCH /atividades/:id                               // ✅ Atualiza atividade
DELETE /atividades/:id                              // ✅ Remove atividade
```

### ⏳ Atividades em Andamento (`/atividadesemandamento`)

```javascript
POST /grupoatividades/:grupoAtividadeId/atividadesemandamento  // ✅ Inicia atividade
GET /atividadesemandamento/:id                                // ✅ Busca atividade em andamento
PATCH /atividadesemandamento/:id                             // ✅ Atualiza atividade em andamento
PATCH /grupos/:grupoId/respostas                             // ✅ Atualiza resposta específica
DELETE /atividadesemandamento/:id                            // ✅ Remove atividade em andamento
```

### ✅ Atividades Finalizadas (`/atividadesfinalizadas`)

```javascript
POST /grupoatividades/:grupoAtividadeId/atividadesfinalizadas  // ✅ Finaliza atividade
GET /atividadesfinalizadas/:id                                // ✅ Busca atividade finalizada
PATCH /atividadesfinalizadas/:id                             // ✅ Atualiza atividade finalizada
DELETE /atividadesfinalizadas/:grupoAtividadesId             // ✅ Remove atividade finalizada
```

### 📝 Exercícios (`/grupoatividades/.../exercicios`)

```javascript
PATCH /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios          // ✅ Adiciona exercício
GET /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId     // ✅ Busca exercício
PATCH /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId   // ✅ Atualiza exercício
DELETE /grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId  // ✅ Remove exercício
```

### 🔄 Atualizações (`/atualizacoes`)

```javascript
POST /atualizacoes          // ❌ Cria nova atualização
GET /atualizacoes           // ❌ Lista todas as atualizações
PUT /atualizacoes/:id       // ❌ Edita atualização
DELETE /atualizacoes/:id    // ❌ Remove atualização
```

### 📊 Dados da Aplicação (`/dadosApp`)

```javascript
POST /dadosApp              // ❌ Gera dados estatísticos
GET /dadosApp               // ✅ Busca dados estatísticos
```

### 📁 Upload de Mídia (`/midia`)

```javascript
POST /midia/post/:id        // ❌ Upload de mídia (Azure Blob Storage)
```

## 🗄️ Estrutura dos Modelos (MongoDB)

### **User Schema**
```javascript
{
  // Dados pessoais
  nome: String,
  email: String,
  telefone: String,
  dataDeNascimento: String,
  foto: String,
  senha: String,
  
  // Configurações de conta
  tipoDeConta: "Admin" | "Profissional" | "Paciente",
  ativo: Boolean,
  validade: String, // formato "dd/mm/yyyy"
  
  // Sistema de moedas e progresso
  moeda: {
    valor: String,
    dataDeCriacao: Date
  },
  nivel: Number,
  
  // Relacionamentos
  profissional: [{
    idDoProfissional: ObjectId,
    nome: String
  }],
  
  // Diagnóstico (apenas Pacientes)
  erros: {
    socializacao: [String],
    cognicao: [String],
    linguagem: [String],
    autoCuidado: [String],
    motor: [String]
  },
  
  // Atividades
  gruposDeAtividadesEmAndamento: [GrupoAtividadeEmAndamento],
  gruposDeAtividadesFinalizadas: [GrupoAtividadeFinalizada]
}
```

### **GrupoAtividades Schema**
```javascript
{
  nomeGrupo: String,
  descricao: String,
  imagem: String,
  identificador: String,
  nivelDaAtividade: Number,
  dominio: [String], // ["TEA", "TDAH", etc.]
  
  criador: {
    id: ObjectId,
    nome: String
  },
  
  atividades: [ObjectId], // Referência para Atividades
  pontuacaoTotalDoGrupo: Number,
  dataCriacao: Date
}
```

### **Atividades Schema**
```javascript
{
  criador: {
    id: ObjectId,
    nome: String
  },
  
  // Informações da atividade
  idade: Number,
  marco: String,
  nomdeDaAtividade: String,
  descicaoDaAtividade: String,
  fotoDaAtividade: String,
  tipoDeAtividade: String,
  
  exercicios: [Exercicio],
  pontuacaoTotalAtividade: Number,
  createdAt: Date
}
```

### **Exercicio Schema (Subdocumento)**
```javascript
{
  exercicioId: ObjectId,
  enunciado: String,
  exercicio: String,
  pontuacao: Number,
  
  midia: {
    tipoDeMidia: "imagem" | "video" | "gif",
    url: String
  },
  
  alternativas: [{
    _id: ObjectId,
    alternativa: String,
    correta: Boolean
  }]
}
```

## 🎯 Controllers - Lógica de Negócio

### **userController.js**
Gerencia todas as operações relacionadas aos usuários:

#### Principais Funções:
- `createUser()` - Cadastra novos usuários com validações
- `loginUser()` - Autenticação com JWT
- `updateUser()` - Atualiza dados do usuário
- `getAllUserAtivosPacientes()` - Lista pacientes vinculados ao profissional
- `updateUserMoeda()` - Sistema de moedas
- `updatePasswordRecovery()` - Recuperação de senha via email
- `novaValidade()` - Webhook para atualizações de assinatura
- `DemoValidade()` - Atualiza período demo

#### Características Especiais:
- **Validação de email**: Verificação de formato e duplicação
- **Criptografia de senha**: BCrypt com salt 12
- **Sistema de validade**: Controle de assinaturas
- **Tipos de conta**: Admin, Profissional, Paciente com permissões diferenciadas

### **grupoAtividadesController.js**
Controla a criação e gerenciamento de grupos de atividades:

#### Principais Funções:
- `createGrupoAtividades()` - Criação manual de grupos
- `createGrupoAtividadesAuto()` - Criação automática baseada no perfil do paciente
- `filterGrupoAtividadesByNivel()` - Filtros inteligentes por nível e tipo
- `getGrupoAtividadesAuto()` - Lista grupos criados automaticamente

#### Lógica Especial:
```javascript
// Algoritmo de criação automática (Pacientes)
1. Analisa o campo "erros" do usuário
2. Busca atividades por marco de desenvolvimento
3. Seleciona aleatoriamente atividades por categoria
4. Verifica atividades já realizadas
5. Adiciona atividades com performance < 85%
6. Completa até 5 atividades por grupo
```

### **atividadeEmAndamentoController.js**
Gerencia o progresso em tempo real:

#### Principais Funções:
- `createAtividadeEmAndamento()` - Inicia nova sessão de atividades
- `updateRespostaAtividadeEmAndamento()` - Atualiza respostas individuais
- `updateAtividadeEmAndamento()` - Atualiza progresso geral

#### Sistema de Pontuação:
```javascript
// Estrutura de resposta
{
  exercicioId: ObjectId,
  atividade_id: ObjectId,
  isCorreta: Boolean,
  pontuacao: Number,
  pontuacaoPossivel: Number,
  porcentagem: Number, // (pontuacao/pontuacaoPossivel) * 100
  tipoAtividade: String
}
```

### **atividadeFinalizadaController.js**
Processa atividades completadas:

#### Principais Funções:
- `createAtividadeFinalizada()` - Finaliza atividades em andamento
- Calcula pontuação final e porcentagem
- Move de "em andamento" para "finalizadas"
- Atualiza estatísticas do usuário

#### Critérios de Aprovação:
- **Aprovado**: Porcentagem ≥ 80%
- **Reprovado**: Porcentagem < 80% (atividade adicionada novamente)

## 🛡️ Middleware de Segurança

### **checkToken.js**
```javascript
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' });
    }
    
    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.user = { _id: decoded.id };
        next();
    } catch (error) {
        res.status(400).json({ msg: 'Token inválido' });
    }
}
```

## 🔧 Funcionalidades Avançadas

### **Sistema de Moedas**
- Atualização diária automática no login
- Recompensas por atividades completadas
- Controle via `updateUserMoeda()`

### **Criação Automática de Atividades**
- Algoritmo baseado no campo `erros` do usuário
- Seleção aleatória por categoria de desenvolvimento
- Reinclusão de atividades com performance baixa

### **Upload de Mídia**
- Integração com Azure Blob Storage
- Suporte a imagem, vídeo e GIF
- Sistema de tokens para acesso seguro

### **Sistema de Validade**
- Integração com RevenueCat para assinaturas
- Webhook para atualizações automáticas
- Controle de período demo

### **Relatórios e Analytics**
- Dados estatísticos da aplicação
- Controle de usuários pagantes vs cadastrados
- Métricas de receita estimada

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+
- MongoDB 4.4+
- Azure Blob Storage (para mídia)

### Instalação
```bash
# Clone o repositório
git clone [repository-url]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor
npm start
```

### Variáveis de Ambiente
```bash
SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection
AZURE_STORAGE_ACCOUNT=your-azure-account
AZURE_STORAGE_KEY=your-azure-key
```

## 📊 Fluxos de Dados Principais

### **Fluxo de Cadastro e Login**
```
1. POST /auth/register → Cadastra usuário
2. POST /auth/login → Autentica e retorna JWT
3. Middleware checkToken → Valida token em rotas protegidas
```

### **Fluxo de Atividades (Paciente)**
```
1. POST /grupoatividadesAuto → Cria grupo personalizado
2. POST /atividadesemandamento → Inicia sessão
3. PATCH /grupos/:id/respostas → Atualiza respostas
4. POST /atividadesfinalizadas → Finaliza e calcula resultados
```

### **Fluxo de Acompanhamento (Profissional)**
```
1. GET /user-ativos-paciente → Lista pacientes vinculados
2. GET /atividadesfinalizadas → Visualiza histórico
3. GET /dadosApp → Acessa estatísticas
```

## 🐛 Depuração e Manutenção

### **Logs Importantes**
- Todos os controllers têm console.log detalhado
- Erros são logados com contexto completo
- Validações incluem mensagens específicas

### **Pontos de Atenção**
1. **Validação de ObjectId**: Sempre verificar se IDs são válidos
2. **População de dados**: Usar `.populate()` para relacionamentos
3. **Middleware de autenticação**: Verificar token em rotas protegidas
4. **Cálculo de pontuação**: Validar exercícios antes de calcular totais

### **Testes Recomendados**
- Autenticação com tokens válidos/inválidos
- Criação de atividades com dados completos/incompletos
- Fluxo completo: criação → progresso → finalização
- Permissões por tipo de usuário


**Desenvolvido com ❤️ pela equipe Stimular**

*Para mais informações técnicas, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.*
