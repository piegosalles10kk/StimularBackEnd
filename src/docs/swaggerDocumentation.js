/**
 * @swagger
 * components:
 *   securitySchemes:
 *     Bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       in: header
 *       name: Authorization
 *       description: Token de autenticação
 */

/**
 * @swagger
 * security:
 *   - Bearer: []
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações relacionadas a usuários.
 */
 
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "usuario@example.com"
 *         nome:
 *           type: string
 *           example: "João Silva"
 *         telefone:
 *           type: string
 *           example: "11976008411"
 *         dataDeNascimento:
 *           type: string
 *           format: date
 *           example: "1999-10-13"
 *         senha:
 *           type: string
 *           example: "12345"
 *         confirmarSenha:
 *           type: string
 *           example: "12345"
 *         tipoDeConta:
 *           type: array
 *           items:
 *             type: string
 *           example: ["tipo1", "tipo2"]
 *         profissional:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Profissional'
 *         validade:
 *           type: string
 *           format: date
 *           example: "2024-10-31"
 *         moeda:
 *           type: number
 *           example: 1
 *         nivel:
 *           type: number
 *           example: 1
 *
 *     Profissional:
 *       type: object
 *       properties:
 *         idDoProfissional:
 *           type: string
 *           example: "12345"
 *         nomeDoProfissional:
 *           type: string
 *           example: "João Silva"
 *
 *     Exercicio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Exercício 1"
 *         descricao:
 *           type: string
 *           example: "Descrição do exercício 1"
 *         nivel:
 *           type: string
 *           example: "Fácil"
 *         tipo:
 *           type: string
 *           example: "Treino"
 *
 * /exercicios:
 *   get:
 *     tags: [Exercicios]
 *     summary: Obter todos os exercícios.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de exercícios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercicio'
 *       500:
 *         description: Erro ao obter os exercícios.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profissional:
 *       type: object
 *       properties:
 *         idDoProfissional:
 *           type: string
 *           example: "12345"
 *         nomeDoProfissional:
 *           type: string
 *           example: "João Silva"
 *
 * /auth/register:
 *   post:
 *     tags: [User]
 *     summary: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 example: "11976008411"
 *               dataDeNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1999-10-13"
 *               senha:
 *                 type: string
 *                 example: "12345"
 *               confirmarSenha:
 *                 type: string
 *                 example: "12345"
 *               tipoDeConta:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tipo1", "tipo2"]
 *               profissional:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Profissional'
 *               validade:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               moeda:
 *                 type: number
 *                 example: 1
 *               nivel:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "usuario@example.com"
 *                 nome:
 *                   type: string
 *                   example: "João Silva"
 *       400:
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro de validação"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */



/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [User]
 *     summary: Realiza o login de um usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               ...
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso.
 *       ...
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Obtém informações de um usuário específico.
 *     security:
 *       - Bearer: [{{ $auth.token }}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     headers:
 *       Authorization:
 *         schema:
 *           type: string
 *           example: {{ $auth.token }}
 *     responses:
 *       200:
 *         description: Informações do usuário.
 *       ...
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Atualiza um usuário existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 example: "11976008411"
 *               dataDeNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1999-10-13"
 *               senha:
 *                 type: string
 *                 example: "12345"
 *               confirmarSenha:
 *                 type: string
 *                 example: "12345"
 *               tipoDeConta:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tipo1", "tipo2"]
 *               profissional:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Profissional'
 *               validade:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               moeda:
 *                 type: number
 *                 example: 1
 *               nivel:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "usuario@example.com"
 *                 nome:
 *                   type: string
 *                   example: "João Silva"
 *       400:
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro de validação"
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Atualiza informações de um usuário específico.
 *     security:
 *       - Bearer: []  // Adiciona a necessidade de autenticação
 *     parameters:
 *       ...
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       ...
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Apaga um usuário específico.
 *     security:
 *       - Bearer: []  // Adiciona a necessidade de autenticação
 *     parameters:
 *       ...
 *     responses:
 *       200:
 *         description: Usuário apagado com sucesso.
 *       ...
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações relacionadas a usuários.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [User]
 *     summary: Cria um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 example: "(11) 91234-5678"
 *               dataDeNascimento:
 *                 type: string
 *                 example: "1990-01-01"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *               confirmarSenha:
 *                 type: string
 *                 example: "senha123"
 *               tipoDeConta:
 *                 type: string
 *                 example: "profissional"
 *               profissional:
 *                 type: array
 *                 items:
 *                   type: string
 *               moeda:
 *                 type: number
 *                 example: 100
 *               validade:
 *                 type: string
 *               nivel:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       422:
 *         description: Campos obrigatórios faltando ou senhas não conferem.
 *       500:
 *         description: Erro ao criar usuário.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [User]
 *     summary: Realiza o login de um usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso.
 *       422:
 *         description: Email e senha são obrigatórios.
 *       404:
 *         description: Usuário não cadastrado.
 *       500:
 *         description: Erro ao autenticar usuário.
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Obtém informações de um usuário específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações do usuário.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       in: header
 *       name: Authorization
 *       description: Token de autenticação
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Atualiza informações de um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@update.com"
 *               // ... outros campos que podem ser atualizados
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       500:
 *         description: Erro ao atualizar usuário.
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Apaga um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário apagado com sucesso.
 *       500:
 *         description: Erro ao apagar usuário.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GrupoAtividades:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Grupo de Atividades 1"
 *         descricao:
 *           type: string
 *           example: "Descrição do grupo de atividades 1"
 *         atividades:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Atividade'
 *
 *     Atividade:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Atividade 1"
 *         descricao:
 *           type: string
 *           example: "Descrição da atividade 1"
 *         exercicios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercicio'
 *
 *     Exercicio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Exercício 1"
 *         descricao:
 *           type: string
 *           example: "Descrição do exercício 1"
 *         nivel:
 *           type: string
 *           example: "Fácil"
 *         tipo:
 *           type: string
 *           example: "Treino"
 *
 * /grupoAtividades:
 *   get:
 *     tags: [Grupo Atividades]
 *     summary: Obter todos os grupos de atividades.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de grupos de atividades.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoAtividades'
 *       500:
 *         description: Erro ao obter os grupos de atividades.
 */

/**
 * @swagger
 * tags:
 *   - name: Grupo Atividades
 *     description: Operações relacionadas a grupos de atividades.
 */

/**
 * @swagger
 * /grupoatividades:
 *   post:
 *     tags: [Grupo Atividades]
 *     summary: Cria um novo Grupo de Atividades.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroAtividade:
 *                 type: number
 *                 example: 1
 *               dominio:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TDAH", "TEA"]
 *               atividades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fotoDaAtividade:
 *                       type: string
 *                       example: "url_da_foto"
 *                     tipoDeAtividade:
 *                       type: string
 *                       example: "Exercício"
 *                     exercicios:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           midia:
 *                             type: string
 *                             example: "url_da_midia"
 *                           enunciado:
 *                             type: string
 *                             example: "Qual é a capital da França?"
 *                           alternativas:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 alternativa:
 *                                   type: string
 *                                 resultadoAlternativa:
 *                                   type: boolean
 *                             example:
 *                               - alternativa: "Paris"
 *                                 resultadoAlternativa: true
 *                               - alternativa: "Londres"
 *                                 resultadoAlternativa: false
 *                               - alternativa: "Berlim"
 *                                 resultadoAlternativa: false
 *                           pontuacao:
 *                             type: number
 *                             example: 10
 *                     pontuacaoTotalAtividade:
 *                       type: number
 *                       example: 15
 *             example:
 *               numeroAtividade: 1
 *               dominio: ["TDAH", "TEA"]
 *               atividades:
 *                 - fotoDaAtividade: "url_da_foto"
 *                   tipoDeAtividade: "Exercício"
 *                   exercicios:
 *                     - midia: "url_da_midia"
 *                       enunciado: "Qual é a capital da França?"
 *                       alternativas:
 *                         - alternativa: "Paris"
 *                           resultadoAlternativa: true
 *                         - alternativa: "Londres"
 *                           resultadoAlternativa: false
 *                         - alternativa: "Berlim"
 *                           resultadoAlternativa: false
 *                       pontuacao: 10
 *                   pontuacaoTotalAtividade: 15
 *     responses:
 *       201:
 *         description: Grupo de Atividades criado com sucesso.
 *       422:
 *         description: Campos obrigatórios faltando ou dados inválidos.
 *       500:
 *         description: Erro ao criar grupo de atividades.
 */

/**
 * @swagger
 * /grupoatividades/{id}:
 *   get:
 *     tags: [Grupo Atividades]
 *     summary: Retorna um Grupo de Atividades específico.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do Grupo de Atividades.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grupo de Atividades retornado com sucesso.
 *       404:
 *         description: Grupo de Atividades não encontrado.
 *       500:
 *         description: Erro ao retornar grupo de atividades.
 */

/**
 * @swagger
 * /grupoatividades/{id}:
 *   put:
 *     tags: [Grupo Atividades]
 *     summary: Atualiza informações de um Grupo de Atividades específico.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do Grupo de Atividades.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Nome Atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição Atualizada"
 *     responses:
 *       200:
 *         description: Grupo de Atividades atualizado com sucesso.
 */

/**
 * @swagger
 * /grupoatividades/{id}:
 *   delete:
 *     tags: [Grupo Atividades]
 *     summary: Remove um Grupo de Atividades específico.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do Grupo de Atividades.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Grupo de Atividades removido com sucesso.
 */

/**
 * @swagger
 * /grupoatividades:
 *   get:
 *     tags: [Grupo Atividades]
 *     summary: Obter todos os grupos de atividades.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de grupos de atividades.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoAtividades'
 *       500:
 *         description: Erro ao obter os grupos de atividades.
 *
 *   patch:
 *     tags: [Grupo Atividades]
 *     summary: Adicionar exercícios a uma atividade.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: atividadeId
 *         required: true
 *         description: ID da atividade.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercicio'
 *     responses:
 *       200:
 *         description: Exercício adicionado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       400:
 *         description: Erro ao adicionar o exercício.
 */

/**
 * @swagger
 * /grupoatividades/{id}/atividades:
 *   post:
 *     tags: [Atividades]
 *     summary: Cria uma nova Atividade em um Grupo.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do Grupo de Atividades.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Nova Atividade"
 *               descricao:
 *                 type: string
 *                 example: "Descrição da nova atividade"
 *     responses:
 *       201:
 *         description: Atividade criada e anexada ao grupo de atividades com sucesso.
 *       ...
 */ 

/**
 * @swagger
 * tags:
 *   name: Atividades
 *   description: Operações relacionadas a atividades.
 */

/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividades:
 *   post:
 *     tags: [Atividades]
 *     summary: Criar uma nova Atividade em um Grupo.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Nova Atividade"
 *               descricao:
 *                 type: string
 *                 example: "Descrição da nova atividade"
 *     responses:
 *       201:
 *         description: Atividade criada e anexada ao grupo de atividades com sucesso.
 *       404:
 *         description: Grupo de Atividades não encontrado.
 *       500:
 *         description: Erro ao criar atividade.
 */

/**
 * @swagger
 * /atividades/{id}:
 *   get:
 *     tags: [Atividades]
 *     summary: Obter Atividade.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade.
 *     responses:
 *       200:
 *         description: Atividade encontrada.
 *       404:
 *         description: Atividade não encontrada.
 *       500:
 *         description: Erro ao obter atividade.
 */

/**
 * @swagger
 * /atividades/{id}:
 *   patch:
 *     tags: [Atividades]
 *     summary: Atualizar Atividade.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Atividade Atualizada"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada da atividade"
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso.
 *       404:
 *         description: Atividade não encontrada.
 *       500:
 *         description: Erro ao atualizar atividade.
 */

/**
 * @swagger
 * /atividades/{id}:
 *   delete:
 *     tags: [Atividades]
 *     summary: Deletar Atividade.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade.
 *     responses:
 *       200:
 *         description: Atividade deletada com sucesso.
 *       404:
 *         description: Atividade não encontrada.
 *       500:
 *         description: Erro ao deletar atividade.
 */

/**
 * @swagger
 * tags:
 *   name: Exercicios
 *   description: Operações relacionadas a exercícios de atividades.
 */

/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividades/{atividadeId}/exercicios:
 *   post:
 *     tags: [Exercicios]
 *     summary: Adicionar Exercício a uma Atividade em um Grupo.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *       - in: path
 *         name: atividadeId
 *         required: true
 *         description: ID da atividade.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Exercício 1"
 *               descricao:
 *                 type: string
 *                 example: "Descrição do exercício"
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso.
 *       404:
 *         description: Grupo de Atividades ou Atividade não encontrada.
 *       500:
 *         description: Erro ao criar exercício.
 */



/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividades/{atividadeId}/exercicios/{exercicioId}:
 *   patch:
 *     tags: [Exercicios]
 *     summary: Atualizar Exercício.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *       - in: path
 *         name: atividadeId
 *         required: true
 *         description: ID da atividade.
 *       - in: path
 *         name: exercicioId
 *         required: true
 *         description: ID do exercício.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Exercício Atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada do exercício"
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso.
 *       404:
 *         description: Grupo de Atividades, Atividade ou Exercício não encontrado.
 *       500:
 *         description: Erro ao atualizar exercício.
 */

/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividades/{atividadeId}/exercicios/{exercicioId}:
 *   delete:
 *     tags: [Exercicios]
 *     summary: Deletar Exercício.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *       - in: path
 *         name: atividadeId
 *         required: true
 *         description: ID da atividade.
 *       - in: path
 *         name: exercicioId
 *         required: true
 *         description: ID do exercício.
 *     responses:
 *       200:
 *         description: Exercício deletado com sucesso.
 *       404:
 *         description: Grupo de Atividades, Atividade ou Exercício não encontrado.
 *       500:
 *         description: Erro ao deletar exercício.
 */

/**
 * @swagger
 * tags:
 *   name: Atividades em Andamento
 *   description: Operações relacionadas a atividades em andamento.
 */

/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividadesemandamento:
 *   post:
 *     tags: [Atividades em Andamento]
 *     summary: Criar Atividade em Andamento.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 example: "2023-10-01T10:00:00Z"
 *               respostas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercicioId:
 *                       type: string
 *                       example: "id_do_exercicio"
 *                     isCorreta:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Atividade em andamento criada com sucesso.
 *       404:
 *         description: Usuário não encontrado ou grupo de atividades não encontrado.
 *       500:
 *         description: Erro ao criar atividade em andamento.
 */

/**
 * @swagger
 * /atividadesemandamento/{id}:
 *   get:
 *     tags: [Atividades em Andamento]
 *     summary: Obter Atividade em Andamento.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade em andamento.
 *     responses:
 *       200:
 *         description: Atividade em andamento encontrada.
 *       404:
 *         description: Atividade em andamento não encontrada.
 *       500:
 *         description: Erro ao obter atividade em andamento.
 */

/**
 * @swagger
 * /atividadesemandamento/{id}:
 *   patch:
 *     tags: [Atividades em Andamento]
 *     summary: Atualizar Atividade em Andamento.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade em andamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 example: "2023-10-01T10:00:00Z"
 *               respostas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercicioId:
 *                       type: string
 *                       example: "id_do_exercicio"
 *                     isCorreta:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Atividade em andamento atualizada com sucesso.
 *       404:
 *         description: Atividade em andamento não encontrada.
 *       500:
 *         description: Erro ao atualizar atividade em andamento.
 */

/**
 * @swagger
 * /atividadesemandamento/{id}:
 *   delete:
 *     tags: [Atividades em Andamento]
 *     summary: Deletar Atividade em Andamento.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade em andamento.
 *     responses:
 *       200:
 *         description: Atividade em andamento deletada com sucesso.
 *       404:
 *         description: Atividade em andamento não encontrada.
 *       500:
 *         description: Erro ao deletar atividade em andamento.
 */


/**
 * @swagger
 * tags:
 *   name: Atividades Finalizadas
 *   description: Operações relacionadas a atividades finalizadas.
 */

/**
 * @swagger
 * /grupoatividades/{grupoAtividadeId}/atividadesfinalizadas:
 *   post:
 *     tags: [Atividades Finalizadas]
 *     summary: Criar Atividade Finalizada.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: grupoAtividadeId
 *         required: true
 *         description: ID do grupo de atividades.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 example: "2023-10-01T10:00:00Z"
 *               dataFinalizada:
 *                 type: string
 *                 example: "2023-10-05T10:00:00Z"
 *               respostasFinais:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercicioId:
 *                       type: string
 *                       example: "id_do_exercicio"
 *                     isCorreta:
 *                       type: boolean
 *                       example: true
 *               pontuacaoFinal:
 *                 type: number
 *                 example: 85
 *     responses:
 *       201:
 *         description: Atividade finalizada criada com sucesso.
 *       404:
 *         description: Usuário não encontrado ou atividade em andamento não encontrada.
 *       500:
 *         description: Erro ao criar atividade finalizada.
 */

/**
 * @swagger
 * /atividadesfinalizadas/{id}:
 *   get:
 *     tags: [Atividades Finalizadas]
 *     summary: Obter Atividade Finalizada.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade finalizada.
 *     responses:
 *       200:
 *         description: Atividade finalizada encontrada.
 *       404:
 *         description: Atividade finalizada não encontrada.
 *       500:
 *         description: Erro ao obter atividade finalizada.
 */

/**
 * @swagger
 * /atividadesfinalizadas/{id}:
 *   patch:
 *     tags: [Atividades Finalizadas]
 *     summary: Atualizar Atividade Finalizada.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade finalizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataFinalizada:
 *                 type: string
 *                 example: "2023-10-05T10:00:00Z"
 *               pontuacaoFinal:
 *                 type: number
 *                 example: 90
 *     responses:
 *       200:
 *         description: Atividade finalizada atualizada com sucesso.
 *       404:
 *         description: Atividade finalizada não encontrada.
 *       500:
 *         description: Erro ao atualizar atividade finalizada.
 */

/**
 * @swagger
 * /atividadesfinalizadas/{id}:
 *   delete:
 *     tags: [Atividades Finalizadas]
 *     summary: Deletar Atividade Finalizada.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade finalizada.
 *     responses:
 *       200:
 *         description: Atividade finalizada deletada com sucesso.
 *       404:
 *         description: Atividade finalizada não encontrada.
 *       500:
 *         description: Erro ao deletar atividade finalizada.
 */

