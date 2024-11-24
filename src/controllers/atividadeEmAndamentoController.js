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

        // Verifica se há atividade_id igual nas novasRespostas
        if (novasRespostas && Array.isArray(novasRespostas)) {
            for (const resposta of novasRespostas) {
                const grupoAtividade = await GrupoAtividades.findById(atividadeEmAndamento.grupoAtividadesId).populate('atividades.exercicios');

                const atividade = grupoAtividade.atividades.find(activity => activity._id.toString() === resposta.atividade_id.toString());
                if (!atividade) throw new Error(`Atividade não encontrada para atividade_id: ${resposta.atividade_id}`);

                // Verifica se o exercício existe
                const exercicio = atividade.exercicios.find(exercise => exercise.exercicioId.toString() === resposta.exercicioId.toString());
                if (!exercicio) throw new Error(`Exercicio não encontrado para exercicioId: ${resposta.exercicioId} dentro da atividade_ID: ${resposta.atividade_id}`);

                // Verifica se já existe uma resposta para este exercício
                const respostaExistenteIndex = atividadeEmAndamento.respostas.findIndex(
                    resp => resp.exercicioId.toString() === exercicio._id.toString()
                );
                
                if (respostaExistenteIndex > -1) {
                    // Se existir, atualiza a resposta existente
                    const respostaExistente = atividadeEmAndamento.respostas[respostaExistenteIndex];

                    // Atualiza apenas os campos que você deseja alterar
                    respostaExistente.isCorreta = resposta.isCorreta; 
                    respostaExistente.pontuacao = resposta.pontuacao;

                    console.log(`Resposta atualizada para exercício_id: ${exercicio._id}, atividade_id: ${resposta.atividade_id}`);
                } else {
                    // Se não existir, adiciona a nova resposta
                    const respostaFormatada = {
                        exercicioId: exercicio._id,
                        atividade_id: new mongoose.Types.ObjectId(resposta.atividade_id),
                        isCorreta: resposta.isCorreta,
                        pontuacao: resposta.pontuacao
                    };
                    atividadeEmAndamento.respostas.push(respostaFormatada);
                    console.log(`Nova resposta adicionada para atividade_id: ${resposta.atividade_id}. Exercicio_ID: ${exercicio._id}`);
                }
            }
        }

        // Atualiza outros campos da atividade, se necessário
        for (const key in req.body) {
            if (key !== 'novasRespostas' && req.body.hasOwnProperty(key)) {
                atividadeEmAndamento[key] = req.body[key];
            }
        }

        await usuario.save();
        console.log(`Atividade em andamento atualizada. ID: ${atividadeEmAndamento._id}`);
        res.status(200).json({ msg: 'Atividade em andamento atualizada com sucesso', atividadeEmAndamento });

    } catch (error) {
        console.log('Erro ao atualizar atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao atualizar atividade em andamento' });
    }
};


// Função para atualizar a resposta de um exercício
const updateRespostaAtividadeEmAndamento = async (req, res) => {
    const { grupoId } = req.params; // ID do grupo de atividades em andamento
    const { atividade_id, exercicioId, alternativaId, isCorreta, pontuacao } = req.body; // Extrai os dados do corpo da requisição

    try {
        const usuario = await User.findById(req.user._id); // Obtém o ID do usuário autenticado
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Encontra o grupo de atividades em andamento pelo ID
        const grupoAtividades = usuario.gruposDeAtividadesEmAndamento.find(grupo => 
            grupo._id.toString() === grupoId
        );

        if (!grupoAtividades) {
            return res.status(404).json({ message: 'Grupo de atividades em andamento não encontrado.' });
        }

        // Verifica se a atividade existe dentro do grupo
        const atividadeEmAndamento = grupoAtividades.respostas.find(resp => 
            resp.atividade_id.toString() === atividade_id && resp.exercicioId.toString() === exercicioId
        );

        if (atividadeEmAndamento) {
            // Atualiza a resposta existente
            atividadeEmAndamento.isCorreta = isCorreta;
            atividadeEmAndamento.pontuacao = pontuacao;
            atividadeEmAndamento.alternativaId = alternativaId; // Atualiza alternativaId
            
            console.log(`Resposta atualizada para exercício_id: ${exercicioId}, atividade_id: ${atividade_id}`);
        } else {
            // Se não existir, cria uma nova resposta
            const novaResposta = {
                exercicioId: exercicioId,
                atividade_id: atividade_id,
                isCorreta: isCorreta,
                pontuacao: pontuacao,
                alternativaId: alternativaId,
            };

            grupoAtividades.respostas.push(novaResposta); // Adiciona nova resposta
            console.log(`Nova resposta adicionada para atividade_id: ${atividade_id}, exercício_id: ${exercicioId}`);
        }

        await usuario.save(); // Salva as alterações no usuário
        res.status(200).json({ msg: 'Resposta atualizada com sucesso', grupoAtividades });

    } catch (error) {
        console.log('Erro ao atualizar resposta na atividade em andamento:', error);
        res.status(500).json({ msg: 'Erro ao atualizar resposta' });
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
    updateRespostaAtividadeEmAndamento,
    deleteAtividadeEmAndamento
};
