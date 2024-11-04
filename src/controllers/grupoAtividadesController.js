const mongoose = require('mongoose');
const { GrupoAtividades, User, Atividades, Exercicios  } = require('../models/User');

// Get GrupoAtividades by ID
const getGrupoAtividades = async (req, res) => {
    const id = req.params.id;
    const grupoAtividades = await GrupoAtividades.findById(id).populate('criador atividades');
    if (!grupoAtividades) {
        return res.status(404).json({ msg: 'Grupo de Atividades não encontrado' });
    }
    res.status(200).json({ grupoAtividades });
};

// Create GrupoAtividades
const createGrupoAtividades = async (req, res) => {
    const criadorId = req.user._id; // Pegando o id do criador a partir do token de autenticação
    console.log('Criador ID:', criadorId); // Log do ID do criador
    const { nomeGrupo, nivelDaAtividade, imagem, dominio, descricao, atividades, pontuacaoTotalDoGrupo } = req.body;
    console.log('Payload recebido:', req.body); // Log do payload recebido
    
    try {
        console.log('Tentando encontrar o criador com ID:', criadorId);
        const criador = await User.findById(criadorId, '-senha');
        //console.log('Criador encontrado:', criador);
        if (!criador) {
            return res.status(404).json({ message: 'Criador não encontrado!' });
        }

        //salvar os exercícios diretamente dentro das atividades
        const savedAtividades = [];
        for (const atividade of atividades) {
            const newAtividade = new Atividades(atividade);
            await newAtividade.save();
            savedAtividades.push(newAtividade);
        }

        const grupoAtividades = new GrupoAtividades({
            nomeGrupo,
            nivelDaAtividade,
            imagem,
            descricao,
            criador: { id: criadorId, nome: criador.nome },
            dominio,
            atividades: savedAtividades, // Salvando os objetos completos das atividades
            pontuacaoTotalDoGrupo
        });

        console.log('Tentando salvar o grupo de atividades:', grupoAtividades);
        await grupoAtividades.save();
        res.status(201).json({ msg: 'Grupo de Atividades criado com sucesso' });
    } catch (error) {
        console.log('Erro ao criar Grupo de Atividades:', error); // Log do erro
        res.status(500).json({ msg: 'Erro ao criar Grupo de Atividades' });
    }
};

// Update GrupoAtividades by ID
const updateGrupoAtividades = async (req, res) => {
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['nivelDaAtividade', 'criador', 'dominio','imagem','descricao', 'nomeGrupo', 'atividades', 'pontuacaoTotalDoGrupo'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Atualizações inválidas!' });
    }

    try {
        const grupoAtividades = await GrupoAtividades.findById(id);
        if (!grupoAtividades) {
            return res.status(404).json({ msg: 'Grupo de Atividades não encontrado' });
        }

        updates.forEach((update) => grupoAtividades[update] = req.body[update]);
        await grupoAtividades.save();
        res.status(200).json({ msg: 'Grupo de Atividades atualizado com sucesso' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro ao atualizar Grupo de Atividades' });
    }
};

// Delete GrupoAtividades by ID
const deleteGrupoAtividades = async (req, res) => {
    const id = req.params.id;
    try {
        const grupoAtividades = await GrupoAtividades.findByIdAndDelete(id);
        if (!grupoAtividades) {
            return res.status(404).json({ msg: 'Grupo de Atividades não encontrado' });
        }
        res.status(200).json({ msg: 'Grupo de Atividades apagado com sucesso' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro ao apagar Grupo de Atividades' });
    }
};

// Filtrar GrupoAtividades por Criador e/ou Dominio
const filterGrupoAtividades = async (req, res) => {
    const { criadorId, dominio } = req.query;
    const filter = {};

    if (criadorId) {
        filter.criador = criadorId;
    }

    if (dominio) {
        filter.dominio = dominio;
    }

    try {
        const grupos = await GrupoAtividades.find(filter);
        if (!grupos.length) {
            return res.status(404).json({ msg: 'Nenhum grupo de atividades encontrado com os filtros fornecidos' });
        }
        res.status(200).json({ grupos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro ao filtrar grupos de atividades' });
    }
};

// Update Atividade com novo Exercício
const addExercicioToAtividade = async (req, res) => {
    const { atividadeId } = req.params; // ID da atividade que será atualizada
    const { novoExercicio } = req.body; // Novo exercício a ser adicionado

    try {
        const atividade = await Atividades.findById(atividadeId);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada!' });
        }

        // Adiciona o novo exercício
        atividade.exercicios.push({
            ...novoExercicio,
            exercicioId: new mongoose.Types.ObjectId() // Gera um novo ID para o exercício
        });

        // Salva a atividade atualizada
        await atividade.save();

        res.status(200).json({ msg: 'Exercício adicionado com sucesso', atividade });
    } catch (error) {
        console.log('Erro ao adicionar exercício à atividade:', error);
        res.status(500).json({ msg: 'Erro ao adicionar exercício à atividade' });
    }
};

const filterGrupoAtividadesByNivel = async (req, res) => {
    const nivel = req.body.nivel; // lê o valor do nível do corpo da requisição
    //console.log('Nível:', nivel); 

  try {
    const atividades = await GrupoAtividades.find({ nivelDaAtividade: { $lte: nivel } });
    if (!atividades.length) {
      return res.status(404).json({ msg: 'Nenhuma atividade encontrada com o nível fornecido' });
    }
    res.status(200).json({ atividades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Erro ao buscar atividades' });
  }
};

module.exports = {
    getGrupoAtividades,
    createGrupoAtividades,
    updateGrupoAtividades,
    deleteGrupoAtividades,
    filterGrupoAtividades,
    addExercicioToAtividade,
    filterGrupoAtividadesByNivel
};