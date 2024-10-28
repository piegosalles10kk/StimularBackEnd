const mongoose = require('mongoose');
const { GrupoAtividades, Atividades } = require('../models/User');

// Adicionar Exercício a uma Atividade em um Grupo
const addExercicioToAtividade = async (req, res) => {
    const { grupoAtividadeId, atividadeId } = req.params;
    const novoExercicio = req.body;

    try {
        const grupoAtividades = await GrupoAtividades.findById(grupoAtividadeId);
        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de Atividades não encontrado!' });
        }

        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        atividade.exercicios.push({
            ...novoExercicio,
            exercicioId: new mongoose.Types.ObjectId()
        });

        await atividade.save();
        res.status(201).json({ msg: 'Exercício criado com sucesso', atividade });
    } catch (error) {
        console.log('Erro ao criar exercício:', error);
        res.status(500).json({ msg: 'Erro ao criar exercício' });
    }
};

// Obter Exercício específico
const getExercicio = async (req, res) => {
    const { grupoAtividadeId, atividadeId, exercicioId } = req.params;

    try {
        const grupoAtividades = await GrupoAtividades.findById(grupoAtividadeId);
        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de Atividades não encontrado!' });
        }

        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        const exercicio = atividade.exercicios.id(exercicioId);
        if (!exercicio) {
            return res.status(404).json({ message: 'Exercício não encontrado!' });
        }

        res.status(200).json({ exercicio });
    } catch (error) {
        console.log('Erro ao obter exercício:', error);
        res.status(500).json({ msg: 'Erro ao obter exercício' });
    }
};

// Atualizar Exercício
const updateExercicio = async (req, res) => {
    const { grupoAtividadeId, atividadeId, exercicioId } = req.params;
    const atualizacao = req.body;

    try {
        const grupoAtividades = await GrupoAtividades.findById(grupoAtividadeId);
        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de Atividades não encontrado!' });
        }

        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        const exercicio = atividade.exercicios.id(exercicioId);
        if (!exercicio) {
            return res.status(404).json({ message: 'Exercício não encontrado!' });
        }

        for (const key in atualizacao) {
            if (atualizacao.hasOwnProperty(key)) {
                exercicio[key] = atualizacao[key];
            }
        }

        await atividade.save();
        res.status(200).json({ msg: 'Exercício atualizado com sucesso', exercicio });
    } catch (error) {
        console.log('Erro ao atualizar exercício:', error);
        res.status(500).json({ msg: 'Erro ao atualizar exercício' });
    }
};

// Delete Exercício
const deleteExercicio = async (req, res) => {
    const { atividadeId, exercicioId } = req.params;

    try {
        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        atividade.exercicios.id(exercicioId).remove();
        await atividade.save();

        res.status(200).json({ msg: 'Exercício deletado com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar exercício:', error);
        res.status(500).json({ msg: 'Erro ao deletar exercício' });
    }
};

module.exports = {
    addExercicioToAtividade,
    getExercicio,
    updateExercicio,
    deleteExercicio
};