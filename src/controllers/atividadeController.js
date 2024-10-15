const { User, AtividadeCriada } = require('../models/User');
const mongoose = require('mongoose');

// CRUD para atividadesCriadas
const createAtividadeCriada = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const id = req.params.id;
        const autorId = req.user._id;
        const atividadesCriadas = req.body;
        if (!atividadesCriadas || !atividadesCriadas.exercicios || !Array.isArray(atividadesCriadas.exercicios) || atividadesCriadas.exercicios.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'Dados malformados' });
        }
        const novaAtividade = new AtividadeCriada({ ...atividadesCriadas, autor: autorId });
        await novaAtividade.save({ session });
        const usuarioAtualizado = await User.findByIdAndUpdate(id, { $push: { atividadesCriadas: novaAtividade._id } }, { new: true, session });
        if (!usuarioAtualizado) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ msg: 'Atividade criada com sucesso', usuario: usuarioAtualizado });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(500).json({ msg: 'Erro ao criar atividade' });
    }
};

const getAtividadesCriadas = async (req, res) => {
    try {
        const atividades = await AtividadeCriada.find();
        res.status(200).json(atividades);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao buscar atividades' });
    }
};

const getAtividadesCriadasFiltradas = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const atividades = await AtividadeCriada.find({
            grupo: { $in: user.acesso },
            autor: { $in: user.profissional }
        });

        res.status(200).json(atividades);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao buscar atividades' });
    }
};

const getAtividadesCriadasFiltradasAutor = async (req, res) => {
    try {
        const { id } = req.params;
        const atividades = await AtividadeCriada.find({
            autor: id // Filtrando pelo ID do autor
        });
        res.status(200).json(atividades);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao buscar atividades' });
    }
};

const updateAtividadeCriada = async (req, res) => {
    const { id } = req.params;
    try {
        await AtividadeCriada.findByIdAndUpdate(id, req.body);
        res.status(200).json({ msg: 'Atividade atualizada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao atualizar atividade' });
    }
};

const deleteAtividadeCriada = async (req, res) => {
    const { id } = req.params;
    try {
        await AtividadeCriada.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Atividade apagada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao apagar atividade' });
    }
};



// CRUD para atividadeFinalizada
const createAtividadeFinalizada = async (req, res) => {
    try {
        const id = req.params.id;
        const novaAtividadeFinalizada = req.body.atividadeFinalizada;
        await User.findByIdAndUpdate(id, { $push: { atividadeFinalizada: novaAtividadeFinalizada } }, { new: true });
        res.status(200).json({ msg: 'Atividade finalizada adicionada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao adicionar atividade finalizada' });
    }
};

const getAtividadesFinalizadas = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user.atividadeFinalizada);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao buscar atividades finalizadas' });
    }
};

const updateAtividadeFinalizada = async (req, res) => {
    const { id } = req.params;
    const { atividadeId } = req.body;
    try {
        await User.updateOne(
            { _id: id, "atividadeFinalizada._id": atividadeId },
            { $set: { "atividadeFinalizada.$": req.body } }
        );
        res.status(200).json({ msg: 'Atividade finalizada atualizada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao atualizar atividade finalizada' });
    }
};

const deleteAtividadeFinalizada = async (req, res) => {
    const { id, atividadeId } = req.params;
    try {
        await User.findByIdAndUpdate(id, { $pull: { atividadeFinalizada: { _id: atividadeId } } });
        res.status(200).json({ msg: 'Atividade finalizada removida com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao remover atividade finalizada' });
    }
};



// CRUD para atividadeEmAndamento
const createAtividadeEmAndamento = async (req, res) => {
    try {
        const id = req.params.id;
        const novaAtividadeEmAndamento = req.body.atividadeEmAndamento;
        await User.findByIdAndUpdate(id, { atividadeEmAndamento: novaAtividadeEmAndamento }, { new: true });
        res.status(200).json({ msg: 'Atividade em andamento criada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao criar atividade em andamento' });
    }
};

const getAtividadeEmAndamento = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user.atividadeEmAndamento);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao buscar atividade em andamento' });
    }
};

const updateAtividadeEmAndamento = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, { atividadeEmAndamento: req.body.atividadeEmAndamento }, { new: true });
        res.status(200).json({ msg: 'Atividade em andamento atualizada com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao atualizar atividade em andamento' });
    }
};

const deleteAtividadeEmAndamento = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, { $unset: { atividadeEmAndamento: "" } });
        res.status(200).json({ msg: 'Atividade em andamento removida com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Erro ao remover atividade em andamento' });
    }};
    

module.exports = {
    createAtividadeCriada,
    getAtividadesCriadas,
    getAtividadesCriadasFiltradas,
    getAtividadesCriadasFiltradasAutor,
    updateAtividadeCriada,
    deleteAtividadeCriada,
    createAtividadeFinalizada,
    getAtividadesFinalizadas,
    updateAtividadeFinalizada,
    deleteAtividadeFinalizada,
    createAtividadeEmAndamento,
    getAtividadeEmAndamento,
    updateAtividadeEmAndamento,
    deleteAtividadeEmAndamento
};
