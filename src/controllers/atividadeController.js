const mongoose = require('mongoose');
const { GrupoAtividades, Atividades } = require('../models/User'); // Certifique-se de importar os modelos corretos

// Create Atividade e anexar ao grupo de atividades
const createAtividade = async (req, res) => {
    const { grupoAtividadeId } = req.params; // ID do grupo de atividades ao qual a nova atividade será anexada
    const novaAtividade = req.body;

    try {
        const grupoAtividades = await GrupoAtividades.findById(grupoAtividadeId);
        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de Atividades não encontrado!' });
        }

        const newAtividade = new Atividades(novaAtividade);
        await newAtividade.save();

        grupoAtividades.atividades.push(newAtividade);
        await grupoAtividades.save();

        res.status(201).json({ msg: 'Atividade criada e anexada ao grupo de atividades com sucesso', grupoAtividades });
    } catch (error) {
        console.log('Erro ao criar atividade:', error);
        res.status(500).json({ msg: 'Erro ao criar atividade' });
    }
};

// Get Atividade
const getAtividade = async (req, res) => {
    const { idGrupoAtividades, idAtividade } = req.params; // Extraindo os IDs

    try {
        // Buscando o grupo de atividades e populando atividades
        const grupoAtividades = await GrupoAtividades.findById(idGrupoAtividades).populate({
            path: 'atividades',
            populate: { path: 'exercicios' } // Populando os exercícios dentro das atividades
        });

        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de Atividades não encontrado!' });
        }

        // Filtrando a atividade pelo ID dentro do grupo encontrado
        const atividade = grupoAtividades.atividades.find(a => a._id.toString() === idAtividade); // Verifica se a atividade está no grupo

        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada no grupo especificado!' });
        }

        console.log('Atividade encontrada:', JSON.stringify(atividade, null, 2)); // Log detalhado
        res.status(200).json({ atividade });
    } catch (error) {
        console.error('Erro ao obter atividade:', error);
        res.status(500).json({ msg: 'Erro ao obter atividade' });
    }
};

// Update Atividade
const updateAtividade = async (req, res) => {
    const { id } = req.params;
    const atualizacao = req.body;

    try {
        const atividade = await Atividades.findById(id);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        for (const key in atualizacao) {
            if (atualizacao.hasOwnProperty(key)) {
                atividade[key] = atualizacao[key];
            }
        }

        await atividade.save();
        res.status(200).json({ msg: 'Atividade atualizada com sucesso', atividade });
    } catch (error) {
        console.log('Erro ao atualizar atividade:', error);
        res.status(500).json({ msg: 'Erro ao atualizar atividade' });
    }
};

// Delete Atividade
const deleteAtividade = async (req, res) => {
    const { id } = req.params;

    try {
        const atividade = await Atividades.findByIdAndDelete(id);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        res.status(200).json({ msg: 'Atividade deletada com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar atividade:', error);
        res.status(500).json({ msg: 'Erro ao deletar atividade' });
    }
};

module.exports = {
    createAtividade,
    getAtividade,
    updateAtividade,
    deleteAtividade
};
