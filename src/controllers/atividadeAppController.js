const mongoose = require('mongoose');
const { User, Atividades  } = require('../models/User');

// Função para calcular a pontuação total dos exercícios
const calcularPontuacaoTotal = (exercicios) => {
    return exercicios.reduce((total, exercicio) => total + exercicio.pontuacao, 0);
};

// Adicionar uma nova Atividade
const addAtividade = async (req, res) => {
    try {
        const criadorId = req.user._id;  

        // Buscar o criador e verificar se existe
        const criador = await User.findById(criadorId).select('-senha');
        if (!criador) {
            return res.status(404).json({ message: 'Criador não encontrado!' });
        }

        

        // Extrair dados da atividade do corpo da requisição
        const { idade, marco, nomdeDaAtividade, descicaoDaAtividade, fotoDaAtividade, tipoDeAtividade, exercicios } = req.body;

        // Verificar se 'exercicios' é um array
        if (!Array.isArray(exercicios)) {
            return res.status(400).json({ message: 'O campo exercicios deve ser um array.' });
        }

        // Criar a nova atividade
        const novaAtividade = new Atividades({
            idade,
            marco,
            nomdeDaAtividade,
            descicaoDaAtividade,
            fotoDaAtividade,
            tipoDeAtividade,
            exercicios,
            pontuacaoTotalDoGrupo: calcularPontuacaoTotal(exercicios),
            criador: {id: criador._id, nome: criador.nome}
        });

        // Log para conferência
        console.log('Dados da nova atividade antes de salvar:', JSON.stringify(novaAtividade.toObject(), null, 2));

        // Salvar a nova atividade e retornar a resposta
        const atividadeSalva = await novaAtividade.save();
        res.status(201).json({ msg: 'Atividade criada com sucesso', atividade: atividadeSalva });
    } catch (error) {
        console.error('Erro ao criar atividade:', error);  // Log do erro

        // Verifique se temos erros de validação
        if (error.name === 'ValidationError') {
            console.error('Erros de validação:', error.errors);
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }

        res.status(500).json({ msg: 'Erro ao criar atividade' });
    }
};



// Obter todas as Atividades
const getAtividades = async (req, res) => {
    try {
        const atividades = await Atividades.find();
        res.status(200).json(atividades);
    } catch (error) {
        console.log('Erro ao obter atividades:', error);
        res.status(500).json({ msg: 'Erro ao obter atividades' });
    }
};

// Obter uma Atividade específica
const getAtividade = async (req, res) => {
    const { atividadeId } = req.params;

    try {
        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }
        res.status(200).json(atividade);
    } catch (error) {
        console.log('Erro ao obter atividade:', error);
        res.status(500).json({ msg: 'Erro ao obter atividade' });
    }
};

// Atualizar uma Atividade
const updateAtividade = async (req, res) => {
    const { atividadeId } = req.params;
    const atualizacao = req.body;

    try {
        const atividade = await Atividades.findById(atividadeId);

        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        // Atualiza apenas os campos fornecidos
        for (const key in atualizacao) {
            if (atualizacao.hasOwnProperty(key)) {
                atividade[key] = atualizacao[key];
            }
        }

        // Recalcular a pontuação total, se houver exercícios atualizados
        if (atualizacao.exercicios) {
            atividade.pontuacaoTotalDoGrupo = calcularPontuacaoTotal(atualizacao.exercicios);
        }
        
        await atividade.save();
        res.status(200).json({ msg: 'Atividade atualizada com sucesso', atividade });
    } catch (error) {
        console.log('Erro ao atualizar atividade:', error);
        res.status(500).json({ msg: 'Erro ao atualizar atividade' });
    }
};

// Deletar uma Atividade
const deleteAtividade = async (req, res) => {
    const { atividadeId } = req.params;

    try {
        const atividade = await Atividades.findByIdAndDelete(atividadeId);
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
    addAtividade,
    getAtividades,
    getAtividade,
    updateAtividade,
    deleteAtividade,
};
