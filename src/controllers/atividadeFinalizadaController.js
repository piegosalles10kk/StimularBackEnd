const mongoose = require('mongoose');
const { User, GruposDeAtividadesEmAndamento } = require('../models/User');

// Create AtividadeFinalizada
const createAtividadeFinalizada = async (req, res) => {
    const usuarioId = req.user._id; // ID do usuário autenticado
    const { grupoAtividadeId } = req.params; // Obtemos o id do grupo de atividades diretamente da rota

    try {
        // Procurando o usuário com grupos de atividades em andamento
        const usuario = await User.findById(usuarioId).populate('gruposDeAtividadesEmAndamento');

        if (!usuario) {
            console.error('Usuário não encontrado!');
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        console.log("Usuário encontrado:", usuario.nome);

        // Encontrar a atividade em andamento baseada no grupo de atividades
        const atividadeEmAndamento = usuario.gruposDeAtividadesEmAndamento.find(
            atividade => atividade.grupoAtividadesId.toString() === grupoAtividadeId // Corrigindo 'grupoId' para 'grupoAtividadesId'
        );

        if (!atividadeEmAndamento) {
            console.error('Atividade em andamento correspondente não encontrada!');
            return res.status(404).json({ message: 'Atividade em andamento correspondente não encontrada!' });
        }

        const dataInicio = atividadeEmAndamento.dataInicio;
        const pontuacaoPossivel = atividadeEmAndamento.pontuacaoPossivel;

        // Prepare as respostas finais
        const respostasFinais = atividadeEmAndamento.respostas.map(resposta => ({
            exercicioId: resposta.exercicioId,
            isCorreta: resposta.isCorreta,
            pontuacao: resposta.pontuacao // Certifique-se de que a pontuação é sempre preenchida
        }));

        // Calcule a pontuação final considerando apenas as respostas corretas
        const pontuacaoFinal = respostasFinais
            .filter(resposta => resposta.isCorreta) // Filtra somente as respostas corretas
            .reduce((total, resposta) => total + (resposta.pontuacao || 0), 0);

        const porcentagem = pontuacaoPossivel > 0 ? (pontuacaoFinal / pontuacaoPossivel) * 100 : 0;

        // Criando a nova atividade finalizada
        const novaAtividadeFinalizada = {
            grupoAtividadesId: new mongoose.Types.ObjectId(grupoAtividadeId),
            dataInicio: dataInicio,
            dataFinalizada: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
            respostasFinais: respostasFinais,
            pontuacaoPossivel: pontuacaoPossivel,
            pontuacaoFinal: pontuacaoFinal,
            porcentagem: porcentagem
        };

        // Usando findOneAndUpdate para atualizar o usuário
        await User.findOneAndUpdate(
            { _id: usuarioId },
            {
                $push: { gruposDeAtividadesFinalizadas: novaAtividadeFinalizada }, // Adiciona a nova atividade finalizada
                $pull: { gruposDeAtividadesEmAndamento: { _id: atividadeEmAndamento._id } } // Remove a atividade em andamento
            },
            { new: true } // Retorna o documento atualizado
        );

        return res.status(201).json({
            msg: 'Atividade finalizada criada com sucesso e removida de atividade em andamento',
            atividadeFinalizada: novaAtividadeFinalizada,
        });

    } catch (error) {
        console.error('Erro ao criar atividade finalizada:', error);
        return res.status(500).json({ msg: 'Erro ao criar atividade finalizada', error: error.message });
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
    const { grupoAtividadesId } = req.params; // ID do grupo de atividades a ser deletado
    console.log("ID do grupo de atividades a ser deletado:", grupoAtividadesId);

    try {
        // Localiza o usuário pelo ID
        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            console.error('Usuário não encontrado!');
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        console.log("Usuário encontrado:", usuario.nome); // Logando o nome do usuário encontrado

        // Localiza a atividade finalizada pelo grupoAtividadesId dentro do array de atividades do usuário
        const atividadeFinalizada = usuario.gruposDeAtividadesFinalizadas.find(
            atividade => atividade.grupoAtividadesId.toString() === grupoAtividadesId
        );

        if (!atividadeFinalizada) {
            console.error('Atividade finalizada não encontrada para o grupoAtividadesId:', grupoAtividadesId);
            return res.status(404).json({ message: 'Atividade finalizada não encontrada!' });
        }

        console.log("Atividade finalizada encontrada:", atividadeFinalizada); // Logando a atividade encontrada

        // Remove a atividade finalizada do array do usuário
        usuario.gruposDeAtividadesFinalizadas = usuario.gruposDeAtividadesFinalizadas.filter(
            atividade => atividade.grupoAtividadesId.toString() !== grupoAtividadesId
        );

        await usuario.save(); // Salva as alterações no usuário
        console.log('Atividade finalizada deletada com sucesso.');

        res.status(200).json({ msg: 'Atividade finalizada deletada com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar atividade finalizada:', error);
        res.status(500).json({ msg: 'Erro ao deletar atividade finalizada' });
    }
};

module.exports = {
    createAtividadeFinalizada,
    getAtividadeFinalizada,
    updateAtividadeFinalizada,
    deleteAtividadeFinalizada
};
