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
    try {
        const criadorId = req.user._id; // Pegando o ID do criador a partir do token de autenticação
        console.log('Criador ID:', criadorId); // Log do ID do criador

        const { nomeGrupo, nivelDaAtividade, imagem, dominio, descricao, atividades, identificador } = req.body;
        console.dir(req.body, { depth: null });        const criador = await User.findById(criadorId, '-senha');
        if (!criador) {
            return res.status(404).json({ message: 'Criador não encontrado!' });
        }

        // Inicializar um array para armazenar as atividades salvas
        const savedAtividades = [];
        let pontuacaoTotalDoGrupo = 0;

        // Processar cada atividade recebida
        for (const atividade of atividades) {
            // Garantir que a pontuação seja um número
            atividade.pontuacaoTotalAtividade = Number(atividade.pontuacaoTotalAtividade) || 0;
            console.log(`Pontuação da atividade "${atividade.nomdeDaAtividade}":`, atividade.pontuacaoTotalAtividade);

            // Criar e salvar a nova atividade
            const newAtividade = new Atividades(atividade);
            await newAtividade.save();
            savedAtividades.push(newAtividade); // Adicionar atividade ao array

            // Somar a pontuação total
            pontuacaoTotalDoGrupo += atividade.pontuacaoTotalAtividade;
        }

        // Log das atividades salvas
        console.log('Atividades salvas:', savedAtividades);
        console.log('Pontuação total calculada do grupo:', pontuacaoTotalDoGrupo);

        // Criar objeto para o grupo de atividades
        const grupoAtividades = new GrupoAtividades({
            nomeGrupo,
            imagem,
            identificador,
            nivelDaAtividade,
            descricao,
            criador: { id: criadorId, nome: criador.nome },
            dominio,
            atividades: savedAtividades, // Usar as atividades salvas
            pontuacaoTotalDoGrupo // A pontuação total do grupo calculada
        });

        // Salvar o grupo de atividades no banco de dados
        await grupoAtividades.save();
        res.status(201).json({ msg: 'Grupo de Atividades criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar Grupo de Atividades:', error); // Log do erro
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
    const nivel = parseInt(req.query.nivel, 10);
    const grupos = req.query.grupo.split(',');
    const tipoDeAtividades = req.query.tipoDeAtividades;

    const usuarioId = req.user._id; // Obtém o ID do usuário a partir do token

    console.log(grupos, nivel, tipoDeAtividades, usuarioId);

    try {
        // Obtendo grupos de atividades finalizadas do usuário
        const usuario = await User.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        const gruposDeAtividadesFinalizadas = usuario.gruposDeAtividadesFinalizadas.map(item => item.grupoAtividadesId);

        let tiposAtividades = [];
        if (tipoDeAtividades) {
            tiposAtividades = tipoDeAtividades.split(',');
        }

        // Diagnóstico: busca atividades no banco sem filtro de tipo
        const atividadesTipoSemFiltro = await GrupoAtividades.find({
            nivelDaAtividade: { $lte: nivel },
            dominio: { $in: grupos }
        });

        console.log('Atividades no banco sem filtro de tipo:', atividadesTipoSemFiltro);

        // Criação do filtro completo
        const filter = {
            nivelDaAtividade: { $gte: nivel },
            dominio: { $in: grupos },
            _id: { $nin: gruposDeAtividadesFinalizadas },
        };

        // Adiciona filtro de tipoDeAtividade usando $elemMatch se houver
        if (tiposAtividades.length > 0) {
            filter.atividades = { $elemMatch: { tipoDeAtividade: { $in: tiposAtividades } } };
        }

        console.log('Filtro aplicado:', filter);

        // Busca as atividades
        const atividades = await GrupoAtividades.find(filter).sort({ nivelDaAtividade: -1 });

        if (!atividades.length) {
            return res.status(404).json({ msg: 'Nenhuma atividade encontrada com o nível fornecido' });
        }

        res.status(200).json({ atividades });
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
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