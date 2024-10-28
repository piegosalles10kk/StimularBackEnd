const mongoose = require('mongoose');
const { User } = require('../models/User');

// Create AtividadeFinalizada
const createAtividadeFinalizada = async (req, res) => {
    const { dataInicio, dataFinalizada, respostasFinais, pontuacaoFinal } = req.body;
    const usuarioId = req.user._id;
    const { grupoAtividadeId } = req.params;

    try {
        const usuario = await User.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Verifica se existe uma atividade em andamento correspondente
        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.find(
            atividade => atividade.grupoAtividadesId.toString() === grupoAtividadeId
        );

        if (!atividadeEmAndamento) {
            return res.status(404).json({ message: 'Atividade em andamento correspondente não encontrada!' });
        }

        // Cria a nova atividade finalizada
        const novaAtividadeFinalizada = {
            grupoAtividadesId: new mongoose.Types.ObjectId(grupoAtividadeId),
            dataInicio: atividadeEmAndamento.dataInicio,
            dataFinalizada: new Date(dataFinalizada),
            respostasFinais,
            pontuacaoFinal
        };

        // Adiciona a nova atividade finalizada
        usuario.gruposDeAtividadesFinalizadas.push(novaAtividadeFinalizada);

        // Remove a atividade em andamento correspondente
        usuario.gruposDeAtividadesEmAndamento = usuario.gruposDeAtividadesEmAndamento.filter(
            atividade => atividade._id.toString() !== atividadeEmAndamento._id.toString()
        );

        await usuario.save();

        res.status(201).json({ msg: 'Atividade finalizada criada com sucesso e removida de atividade em andamento', atividadeFinalizada: novaAtividadeFinalizada });
    } catch (error) {
        console.log('Erro ao criar atividade finalizada:', error);
        res.status(500).json({ msg: 'Erro ao criar atividade finalizada' });
    }
};

// Get AtividadeFinalizada
const getAtividadeFinalizada = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findById(req.user._id);
        const atividadeFinalizada = usuario.gruposDeAtividadesFinalizadas.id(id);

        if (!atividadeFinalizada) {
            return res.status(404).json({ message: 'Atividade finalizada não encontrada!' });
        }

        res.status(200).json({ atividadeFinalizada });
    } catch (error) {
        console.log('Erro ao obter atividade finalizada:', error);
        res.status(500).json({ msg: 'Erro ao obter atividade finalizada' });
    }
};

// Update AtividadeFinalizada
const updateAtividadeFinalizada = async (req, res) => {
    const { id } = req.params;
    const atualizacao = req.body;

    try {
        const usuario = await User.findById(req.user._id);
        const atividadeFinalizada = usuario.gruposDeAtividadesFinalizadas.id(id);

        if (!atividadeFinalizada) {
            return res.status(404).json({ message: 'Atividade finalizada não encontrada!' });
        }

        for (const key in atualizacao) {
            if (atualizacao.hasOwnProperty(key)) {
                atividadeFinalizada[key] = atualizacao[key];
            }
        }

        await usuario.save();
        res.status(200).json({ msg: 'Atividade finalizada atualizada com sucesso', atividadeFinalizada });
    } catch (error) {
        console.log('Erro ao atualizar atividade finalizada:', error);
        res.status(500).json({ msg: 'Erro ao atualizar atividade finalizada' });
    }
};

// Delete AtividadeFinalizada
const deleteAtividadeFinalizada = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findById(req.user._id);
        const atividadeFinalizada = usuario.gruposDeAtividadesFinalizadas.id(id);

        if (!atividadeFinalizada) {
            return res.status(404).json({ message: 'Atividade finalizada não encontrada!' });
        }

        // Remove a atividade finalizada do array do usuário
        atividadeFinalizada.remove();
        await usuario.save();

        res.status(200).json({ msg: 'Atividade finalizada deletada com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar atividade finalizada:', error);
        res.status(500).json({ msg: 'Erro ao deletar atividade finalizada' });
    }
};

module.exports = {
    createAtividadeFinalizada,
    getAtividadeFinalizada,
    updateAtividadeFinalizada,
    deleteAtividadeFinalizada
};
