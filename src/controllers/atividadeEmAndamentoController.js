const mongoose = require('mongoose');
const { User, GrupoAtividades } = require('../models/User');

// Create AtividadeEmAndamento
const createAtividadeEmAndamento = async (req, res) => {
    const { respostas } = req.body; // Obtemos as respostas do corpo da requisição
    const usuarioId = req.user._id; // ID do usuário autenticado
    const { grupoAtividadeId } = req.params; // ID do grupo de atividades

    try {
        // Localiza a atividade pelo grupoAtividadeId para pegar a pontuacaoTotalDoGrupo
        const grupoAtividade = await GrupoAtividades.findById(grupoAtividadeId);

        if (!grupoAtividade) {
            return res.status(404).json({ message: 'Grupo de atividades não encontrado.' });
        }

        // Agora pegamos o valor de pontuacaoTotalDoGrupo
        const pontuacaoPossivel = grupoAtividade.pontuacaoTotalDoGrupo;

        // Estrutura da nova atividade em andamento
        const novaAtividadeEmAndamento = {
            grupoId: new mongoose.Types.ObjectId(grupoAtividadeId),
            dataInicio: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
            pontuacaoPossivel,
            respostas: respostas.map(resposta => ({
                exercicioId: new mongoose.Types.ObjectId(resposta.exercicioId),
                isCorreta: resposta.isCorreta,
                // Inclua pontuação se necessária com base em sua lógica
                pontuacao: resposta.pontuacao // Presumindo que isso vem do frontend como parte de cada resposta.
            }))
        };

        // Primeiro, remover atividades anteriores com o mesmo grupo de atividades
        await User.updateOne(
            { _id: usuarioId },
            { $pull: { gruposDeAtividadesEmAndamento: { grupoId: grupoAtividadeId } } } // Remove todas as atividades em andamento deste grupo
        );

        // Atualizar o usuário para incluir a nova atividade
        await User.findByIdAndUpdate(
            usuarioId,
            { $push: { gruposDeAtividadesEmAndamento: novaAtividadeEmAndamento } },
            { new: true } // Retorna o documento atualizado
        );

        return res.status(201).json({ message: 'Atividade em andamento criada com sucesso!' });

    } catch (error) {
        console.error("Erro ao criar atividade em andamento:", error);
        return res.status(400).json({ error: error.message });
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
    const { id } = req.params; // ID da atividade em andamento a ser atualizada
    const { novasRespostas } = req.body; // Estrutura do corpo que contém novasRespostas

    try {
        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.id(id);
        if (!atividadeEmAndamento) {
            return res.status(404).json({ message: 'Atividade em andamento não encontrada!' });
        }

        // Adicione as novas respostas ao array de respostas existentes
        if (novasRespostas && Array.isArray(novasRespostas)) {
            // Mapeie as novas respostas para o formato necessário e adiciona ao array existente
            const respostasFormatadas = novasRespostas.map(resposta => ({
                exercicioId: new mongoose.Types.ObjectId(resposta.exercicioId),
                isCorreta: resposta.isCorreta,
                pontuacao: resposta.pontuacao // Certifique-se de que essa pontuação está corretamente definida
            }));

            // Concatena as novas respostas ao array existente
            atividadeEmAndamento.respostas = atividadeEmAndamento.respostas.concat(respostasFormatadas);
        }

        // Se precisar atualizar outros campos da atividade, faça isso aqui
        for (const key in req.body) {
            if (key !== 'novasRespostas' && req.body.hasOwnProperty(key)) {
                atividadeEmAndamento[key] = req.body[key];
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
