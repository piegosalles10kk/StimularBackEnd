const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAllUser = async (req, res) => {
    const users = await User.find({},'-senha');
    res.status(200).json({ users });
};

const getAllUserAtivos = async (req, res) => {
    try {
      // Buscar os usuários ativos e ordenar pela data de criação em ordem decrescente
      const users = await User.find({ ativo: true }, '-senha').sort({ _id: -1 });
      res.status(200).json({ users });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  };

  const getAllUserAtivosPacientes = async (req, res) => {
    try {
        // Recupera o ID e o nome do criador
        const criadorId = req.user?._id;
        if (!criadorId) {
            return res.status(400).json({ msg: 'ID do criador não encontrado no token.' });
        }

        const criador = await User.findById(criadorId, '-senha');
        if (!criador) {
            return res.status(404).json({ msg: 'Criador não encontrado no banco de dados.' });
        }

        console.log(`ID do criador recebido: ${criadorId}`);
        console.log(`Criador encontrado: ${criador.nome}`);

        // Buscar os usuários ativos do tipo "Paciente"
        const users = await User.find({ ativo: true, tipoDeConta: 'Paciente' }, '-senha');

        // Filtra os usuários para encontrar aqueles que têm o criador como profissional
        const filteredUsers = users.filter(user => 
            user.profissional.some(prof => 
                prof.idDoProfissional.toString() === criadorId.toString() && prof.nome === criador.nome
            )
        );

        res.status(200).json({ users: filteredUsers });
        console.log(`Usuários encontrados: ${filteredUsers.length}`);
        

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const getUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-senha');
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(200).json({ user });
};

const createUser = async (req, res) => {
    const { email, nome, foto, telefone, dataDeNascimento, senha, confirmarSenha, tipoDeConta, moeda, ativo } = req.body;
  
    // Log do payload recebido
    //console.log('Payload recebido:', req.body);
  
    // Verificar campos obrigatórios
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!nome) missingFields.push('nome');
    if (!telefone) missingFields.push('telefone');
    if (!dataDeNascimento) missingFields.push('dataDeNascimento');
    if (!senha) missingFields.push('senha');
    if (senha !== confirmarSenha) missingFields.push('Senhas não conferem');
    if (!tipoDeConta) missingFields.push('tipoDeConta');
    if (!moeda) missingFields.push('moeda');
    if (!ativo) missingFields.push('ativo');
  
    if (missingFields.length > 0) {
      console.log('Campos obrigatórios faltando:', missingFields.join(', '));
      return res.status(422).json({ message: `Campos obrigatórios faltando: ${missingFields.join(', ')}` });
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(422).json({ message: 'Email já cadastrado!' });
    }
  
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);
  
    //Tempo de Demo
    const dias = 30;

        // Pegando a data de hoje
        const dataHoje = new Date();

        // Somando os dias informados
        dataHoje.setDate(dataHoje.getDate() + parseInt(dias, 10));

        // Formatar a nova validade
        const formatDate = (date) => {
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };
        

    // Definir validade para Admin ou Profissional
    const validade = (tipoDeConta === 'Admin' || tipoDeConta === 'Profissional') ? '31/12/2999' : formatDate(dataHoje);
  
    // Definir grupo baseado no tipo de conta
    const grupo = (tipoDeConta === 'Admin') ? ['Admin'] : (tipoDeConta === 'Profissional') ? ['Profissional'] : [];
  
    // Definir objeto profissional fixo para Profissionais
    const profissional = (tipoDeConta === 'Profissional') ? [{
        idDoProfissional: '672243e4effa46003373d4f4',
        nome: 'Stimular'
      }] : [];
  
    const user = new User({
      email,
      nome,
      telefone,
      dataDeNascimento,
      senha: passwordHash,
      tipoDeConta,
      profissional,
      moeda,
      validade,
      grupo,
      foto,
      ativo: true
    });
  
    try {
      await user.save();
      res.status(201).json({ msg: 'Usuário criado com sucesso' });
    } catch (error) {
      console.log('Erro ao criar usuário:', error);
      res.status(500).json({ msg: 'Erro ao criar usuário' });
    }
  };
  

    
  const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        console.log('Dados recebidos para atualização:', req.body); // Logar os dados recebidos

        // Consultar o usuário atual
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Preservar o campo 'ativo' a menos que seja explicitamente alterado
        const updates = { ...req.body, ativo: req.body.ativo !== undefined ? req.body.ativo : user.ativo };

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ msg: 'Usuário atualizado com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao atualizar usuário' });
    }
};



const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Usuário apagado com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao apagar usuário' });
    }
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(422).json({ message: 'Email e senha são obrigatórios!' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'Usuário não cadastrado!' });
    }

    const checkPassword = await bcrypt.compare(senha, user.senha);

    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha inválida!' });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id, tipoDeConta: user.tipoDeConta, nivel: user.nivel, grupo: user.grupo, ativo: user.ativo, validade: user.validade }, secret);

        // Inclua o ID do usuário na resposta
        res.status(200).json({
            msg: 'Autenticação realizada com sucesso',
            token,
            tipoDeConta: user.tipoDeConta,
            grupoDoUser: user.grupo,
            ativo: user.ativo,
            id: user._id ,
            validade: user.validade
            // Adicionando o ID do usuário aqui
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao autenticar usuário' });
    }
};


const updateUserMoeda = async (req, res) => {
    const id = req.params.id;

    // Extraia as informações de moeda do corpo da requisição
    const { valor, dataDeCriacao } = req.body.moeda || {};

    // Verifique se o valor é fornecido
    if (valor === undefined) {
        return res.status(400).json({ msg: 'Valor é obrigatório' });
    }

    try {
        //console.log('Dados recebidos para atualização do campo moeda:', req.body); // Loga os dados recebidos

        // Primeiro, busque o usuário atual para obter a moeda existente
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Prepare o objeto de moeda a ser atualizado
        const moedaUpdate = {
            valor,
            dataDeCriacao: dataDeCriacao || user.moeda.dataDeCriacao // Preserve o valor atual se não for fornecido
        };

        // Atualiza apenas o campo moeda do usuário
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { moeda: moedaUpdate },
            { new: true }
        );

        res.status(200).json({ msg: 'Moeda do usuário atualizada com sucesso' });
    } catch (err) {
        console.log('Erro ao atualizar moeda:', err);
        res.status(500).json({ msg: 'Erro ao atualizar moeda do usuário' });
    }
};


const updatePasswordRecovery = async (req, res) => {
    const { email, codigoRecuperarSenha, senha, confirmarSenha } = req.body;

    // Verifica se a senha e a confirmação da senha são fornecidas e se coincidem
    if (!senha || senha !== confirmarSenha) {
        return res.status(422).json({ msg: 'Senhas não conferem ou campos obrigatórios faltando!' });
    }

    try {
        // Busca o usuário pelo email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Verifica se o código de recuperação de senha está correto
        if (user.codigoRecuperarSenha !== codigoRecuperarSenha) {
            return res.status(400).json({ msg: 'Código de recuperação de senha incorreto' });
        }

        // Gera um salt e uma hash para a nova senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        // Atualiza a senha do usuário e remove o código de recuperação de senha
        user.senha = passwordHash;
        user.codigoRecuperarSenha = undefined;
        await user.save();

        res.status(200).json({ msg: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.log('Erro ao atualizar a senha:', error);
        res.status(500).json({ msg: 'Erro ao atualizar a senha' });
    }
};


const updatePassword = async (req, res) => {
    const id = req.params.id;
    const { senhaAtual, senhaNova, confirmarSenhaNova } = req.body;

    // Verifica se a nova senha e a confirmação da nova senha são fornecidas e se coincidem
    if (!senhaNova || senhaNova !== confirmarSenhaNova) {
        return res.status(422).json({ msg: 'Novas senhas não conferem ou campos obrigatórios faltando!' });
    }

    try {
        // Busca o usuário pelo ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Verifica se a senha atual está correta
        const isMatch = await bcrypt.compare(senhaAtual, user.senha);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Senha atual incorreta' });
        }

        // Gera um salt e uma hash para a nova senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senhaNova, salt);

        // Atualiza a senha do usuário
        user.senha = passwordHash;
        await user.save();

        res.status(200).json({ msg: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro ao atualizar a senha' });
    }
};

const AtivoOuInativo = async (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body;

    try {
        // Encontrar o usuário pelo ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Alternar o status de ativo
        user.motivoDesativacao = motivo;
        user.ativo = !user.ativo;

        // Salvar as alterações
        await user.save();

        res.status(200).json({ message: 'Status de ativo atualizado com sucesso', ativo: user.ativo });
    } catch (error) {
        console.error("Erro ao atualizar o status de ativo do usuário:", error);
        res.status(500).json({ error: 'Erro ao atualizar o status do usuário' });
    }
};

const verificarEmailCadastrado = async (req, res) => {
    const { email } = req.params;

    // Expressão regular para validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar se o formato do email é válido
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    try {
        // Encontrar o usuário pelo email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se o email já está cadastrado
        return res.status(200).json({ message: 'Email já cadastrado' });
    } catch (error) {
        console.error("Erro ao verificar o email do usuário:", error);
        res.status(500).json({ error: 'Erro ao verificar o email do usuário' });
    }
};

const novaValidade = async (req, res) => {
    try {
        const { app_user_id, type, expiration_at_ms } = req.body.event; // Ajuste para capturar os dados corretamente

        // Garantir que estamos processando apenas eventos relevantes
        if (type !== 'RENEWAL' && type !== 'INITIAL_PURCHASE') {
            return res.status(200).json({ message: 'Evento ignorado', event: req.body.event });
        }

        // Encontrar usuário no banco de dados
        const user = await User.findById(app_user_id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Converter timestamp de milissegundos para data válida
        const parseDate = (timestamp) => new Date(timestamp);

        // Formatar a nova validade
        const formatDate = (date) => {
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        // Atualizar validade do usuário com a data de expiração enviada pelo RevenueCat
        user.validade = formatDate(parseDate(expiration_at_ms));
        user.assinatura = formatDate(parseDate(expiration_at_ms))
        await user.save();

        res.status(200).json({
            message: 'Validade do usuário atualizada com sucesso!',
            novaValidade: user.validade,
        });

    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        res.status(500).json({ error: 'Erro ao atualizar validade' });
    }
};

const DemoValidade = async (req, res) => {
    try {
        const { id, dias } = req.params;

        // Encontrar usuário no banco de dados
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Pegando a data de hoje
        const dataHoje = new Date();

        // Somando os dias informados
        dataHoje.setDate(dataHoje.getDate() + parseInt(dias, 10));

        // Formatar a nova validade
        const formatDate = (date) => {
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        // Atualizar validade do usuário com a nova data calculada
        user.validade = formatDate(dataHoje);
        await user.save();

        res.status(200).json({
            message: 'Validade do usuário atualizada com sucesso!',
            novaValidade: user.validade,
        });

    } catch (error) {
        console.error("Erro ao processar atualização de validade:", error);
        res.status(500).json({ error: 'Erro ao atualizar validade' });
    }
};


module.exports = { getUser, getAllUser, createUser, updateUser, deleteUser, loginUser, updateUserMoeda, updatePassword, updatePasswordRecovery, getAllUserAtivos, AtivoOuInativo, getAllUserAtivosPacientes, verificarEmailCadastrado, novaValidade, DemoValidade };
