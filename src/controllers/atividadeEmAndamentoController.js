const mongoose = require('mongoose');
const { User, GrupoAtividades } = require('../models/User');

//POST AtividadeEmAndamento
const createAtividadeEmAndamento = async (req, res) => {
    const { respostas } = req.body; // Obtém as respostas do corpo da requisição
    const usuarioId = req.user._id; // ID do usuário autenticado
    const { grupoAtividadeId } = req.params; // ID do grupo de atividades

    try {
        // Busca o grupo de atividades
        const grupoAtividade = await GrupoAtividades.findById(grupoAtividadeId).populate('atividades.exercicios');
        if (!grupoAtividade) return res.status(404).json({ message: 'Grupo de atividades não encontrado.' });

        const pontuacaoPossivel = grupoAtividade.pontuacaoTotalDoGrupo;

        // Mapeia as respostas e valida
        const respostasValidas = respostas.map(resposta => {
            // Verifica se a atividade existe
            const atividade = grupoAtividade.atividades.find(activity => activity._id.toString() === resposta.atividade_id.toString());
            if (!atividade) throw new Error(`Atividade não encontrada para atividade_id: ${resposta.atividade_id}`);

            // Verifica se o exercício existe
            const exercicio = atividade.exercicios.find(exercise => exercise.exercicioId.toString() === resposta.exercicioId.toString());
            if (!exercicio) throw new Error(`Exercicio não encontrado para exercicioId: ${resposta.exercicioId} dentro da atividade_ID: ${resposta.atividade_id}`);

            // Retorna o objeto de resposta válido
            return {
                exercicioId: exercicio._id, // ID do exercício
                atividade_id: new mongoose.Types.ObjectId(resposta.atividade_id), // ID da atividade
                isCorreta: resposta.isCorreta,
                pontuacao: resposta.pontuacao
            };
        });

        // Verifica se já existe atividade_id igual no banco
        for (const resposta of respostas) {
            // Busca por atividades em andamento do usuário
            const atividadesExistentes = await User.findOne({ 
                _id: usuarioId,
                'gruposDeAtividadesEmAndamento.respostas.atividade_id': resposta.atividade_id 
            });

            if (atividadesExistentes) {
                // Remove todas as atividades com o mesmo atividade_id
                await User.updateMany(
                    { _id: usuarioId },
                    { $pull: { gruposDeAtividadesEmAndamento: { 'respostas.atividade_id': resposta.atividade_id } } }
                );
                console.log(`Atividades com atividade_id: ${resposta.atividade_id} removidas com sucesso.`);
            }
        }

        // Estrutura da nova atividade em andamento
        const novaAtividadeEmAndamento = {
            grupoAtividadesId: new mongoose.Types.ObjectId(grupoAtividadeId), // ID do grupo de atividades
            dataInicio: new Date(), // Captura a data e hora
            pontuacaoPossivel, // Pontuação total do grupo
            respostas: respostasValidas // Respostas válidas
        };

        console.log("Nova Atividade em Andamento:", novaAtividadeEmAndamento);

        // Atualiza o usuário para incluir a nova atividade
        await User.findByIdAndUpdate(
            usuarioId,
            { $push: { gruposDeAtividadesEmAndamento: novaAtividadeEmAndamento } },
            { new: true }
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

        // Verifica se há atividade_id igual nas novasRespostas e remove as atividades existentes, se necessário
        if (novasRespostas && Array.isArray(novasRespostas)) {
            for (const resposta of novasRespostas) {
                // Busca atividades existentes com o mesmo atividade_id
                const atividadesExistentes = await User.findOne({
                    _id: usuario._id,
                    'gruposDeAtividadesEmAndamento.respostas.atividade_id': resposta.atividade_id
                });

                if (atividadesExistentes) {
                    // Remove as atividades com o mesmo atividade_id
                    await User.updateMany(
                        { _id: usuario._id },
                        { $pull: { gruposDeAtividadesEmAndamento: { 'respostas.atividade_id': resposta.atividade_id } } }
                    );
                    console.log(`Atividades com atividade_id: ${resposta.atividade_id} removidas com sucesso.`); // Log da atividade removida
                }

                // Obtém a atividade atual do grupo que corresponde ao atividade_id
                const grupoAtividade = await GrupoAtividades.findById(atividadeEmAndamento.grupoAtividadesId).populate('atividades.exercicios');

                const atividade = grupoAtividade.atividades.find(activity => activity._id.toString() === resposta.atividade_id.toString());
                if (!atividade) throw new Error(`Atividade não encontrada para atividade_id: ${resposta.atividade_id}`);

                // Verifica se o exercício existe
                const exercicio = atividade.exercicios.find(exercise => exercise.exercicioId.toString() === resposta.exercicioId.toString());
                if (!exercicio) throw new Error(`Exercicio não encontrado para exercicioId: ${resposta.exercicioId} dentro da atividade_ID: ${resposta.atividade_id}`);

                // Formata a resposta
                const respostaFormatada = {
                    exercicioId: exercicio._id, // ID do exercício
                    atividade_id: new mongoose.Types.ObjectId(resposta.atividade_id), // ID da atividade
                    isCorreta: resposta.isCorreta,
                    pontuacao: resposta.pontuacao
                };

                // Adiciona a nova resposta ao array de respostas da atividade em andamento
                atividadeEmAndamento.respostas.push(respostaFormatada);
                console.log(`Resposta adicionada para atividade_id: ${resposta.atividade_id}. Exercicio_ID: ${exercicio._id}`); // Log da nova resposta
            }
        }

        // Se precisar atualizar outros campos da atividade, faça isso aqui
        for (const key in req.body) {
            if (key !== 'novasRespostas' && req.body.hasOwnProperty(key)) {
                atividadeEmAndamento[key] = req.body[key];
            }
        }

        await usuario.save();
        console.log(`Atividade em andamento atualizada. ID: ${atividadeEmAndamento._id}`); // Log da atividade atualizada
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
