const mongoose = require('mongoose');
const { User } = require('../models/User');

// Create AtividadeEmAndamento
const createAtividadeEmAndamento = async (req, res) => {
    const { dataInicio, respostas } = req.body;
    const usuarioId = req.user._id;
    const { grupoAtividadeId } = req.params;

    try {
        // Cria a nova atividade em andamento como objeto
        const novaAtividadeEmAndamento = {
            grupoAtividadesId: new mongoose.Types.ObjectId(grupoAtividadeId),
            dataInicio,
            respostas: respostas.map(resposta => ({
                exercicioId: new mongoose.Types.ObjectId(resposta.exercicioId),
                isCorreta: resposta.isCorreta
            }))
        };

        // Atualiza o objeto do usuário com a atividade completa
        const usuario = await User.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        usuario.gruposDeAtividadesEmAndamento.push(novaAtividadeEmAndamento);
        await usuario.save();

        res.status(201).json({ msg: 'Atividade em andamento criada com sucesso', atividadeEmAndamento: novaAtividadeEmAndamento });
    } catch (error) {
        console.log('Erro ao criar atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao criar atividade em andamento' });
    }
};

// Get AtividadeEmAndamento
const getAtividadeEmAndamento = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.id(id);
        if (!atividadeEmAndamento) {
            return res.status(404).json({ message: 'Atividade em andamento não encontrada!' });
        }

        res.status(200).json({ atividadeEmAndamento });
    } catch (error) {
        console.log('Erro ao obter atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao obter atividade em andamento' });
    }
};

// Update AtividadeEmAndamento
const updateAtividadeEmAndamento = async (req, res) => {
    const { id } = req.params;
    const atualizacao = req.body;

    try {
        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.id(id);
        if (!atividadeEmAndamento) {
            return res.status(404).json({ message: 'Atividade em andamento não encontrada!' });
        }

        for (const key in atualizacao) {
            if (atualizacao.hasOwnProperty(key)) {
                atividadeEmAndamento[key] = atualizacao[key];
            }
        }

        await usuario.save();
        res.status(200).json({ msg: 'Atividade em andamento atualizada com sucesso', atividadeEmAndamento });
    } catch (error) {
        console.log('Erro ao atualizar atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao atualizar atividade em andamento' });
    }
};

// Delete AtividadeEmAndamento
const deleteAtividadeEmAndamento = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.id(id);
        if (!atividadeEmAndamento) {
            return res.status(404).json({ message: 'Atividade em andamento não encontrada!' });
        }

        // Remove a atividade em andamento do array do usuário
        atividadeEmAndamento.remove();
        await usuario.save();

        res.status(200).json({ msg: 'Atividade em andamento deletada com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao deletar atividade em andamento' });
    }
};

module.exports = {
    createAtividadeEmAndamento,
    getAtividadeEmAndamento,
    updateAtividadeEmAndamento,
    deleteAtividadeEmAndamento
};
