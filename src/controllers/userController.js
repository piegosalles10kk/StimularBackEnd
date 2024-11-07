const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAllUser = async (req, res) => {
    const users = await User.find({},'-senha');
    res.status(200).json({ users });
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
    const { email, nome, foto, telefone, dataDeNascimento, senha, confirmarSenha, tipoDeConta, profissional, moeda, validade, nivel, grupo } = req.body;
    if (!email || !nome || !telefone || !dataDeNascimento || !senha || senha !== confirmarSenha || !tipoDeConta) {
        return res.status(422).json({ message: 'Campos obrigatórios faltando ou senhas não conferem!' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(422).json({ message: 'Email já cadastrado!' });
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);
    const user = new User({ email, nome, telefone, dataDeNascimento, senha: passwordHash, tipoDeConta, profissional, moeda, validade, nivel, foto, grupo });
    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro ao criar usuário' });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        console.log('Dados recebidos para atualização:', req.body); // Loga os dados recebidos
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        res.status(200).json({ msg: 'Usuário atualizado com sucesso', user: updatedUser });
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
        const token = jwt.sign({ id: user._id, tipoDeConta: user.tipoDeConta, nivel: user.nivel }, secret);
        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token, tipoDeConta: user.tipoDeConta });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao autenticar usuário' });
    }
};


module.exports = { getUser, getAllUser, createUser, updateUser, deleteUser, loginUser };
