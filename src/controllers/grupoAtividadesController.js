const mongoose = require('mongoose');
const { GrupoAtividades, User, Atividades, GruposDeAtividadesFinalizadas   } = require('../models/User');

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
    const allowedUpdates = ['nivelDaAtividade', 'criador', 'dominio', 'imagem', 'descricao', 'nomeGrupo', 'atividades', 'pontuacaoTotalDoGrupo'];
  
    // Logs detalhados para debug
    console.log("ID do Grupo:", id);
    console.log("Propriedades para atualização:", updates.join(", "));
    console.log("Objeto recebido para atualização:", JSON.stringify(req.body, null, 2));
  
    // Filtrar atualizações apenas para as permitidas
    const filteredUpdates = updates.filter(update => allowedUpdates.includes(update));
    console.log("Propriedades filtradas para atualização:", filteredUpdates.join(", "));
  
    if (filteredUpdates.length !== updates.length) {
      console.log("Algumas atualizações foram filtradas porque não são permitidas.");
    }
  
    try {
      console.log(`Buscando grupo de atividades com o ID: ${id}`);
      const grupoAtividades = await GrupoAtividades.findById(id);
  
      if (!grupoAtividades) {
        console.log("Grupo de Atividades não encontrado pelo ID:", id);
        return res.status(404).json({ msg: 'Grupo de Atividades não encontrado' });
      }
  
      // Aplicar apenas as atualizações filtradas
      filteredUpdates.forEach((update) => {
        console.log(`Atualizando ${update} para ${req.body[update]}`);
        grupoAtividades[update] = req.body[update];
      });
  
      console.log("Grupo de Atividades antes de salvar:", JSON.stringify(grupoAtividades, null, 2));
      await grupoAtividades.save();
      console.log("Grupo de Atividades atualizado com sucesso:", JSON.stringify(grupoAtividades, null, 2));
      res.status(200).json({ msg: 'Grupo de Atividades atualizado com sucesso' });
    } catch (error) {
      console.log("Erro ao atualizar Grupo de Atividades:", error);
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

const createGrupoAtividadesAuto = async (req, res) => {
    try {
        console.log('Início da execução.');

        // Pega o ID do criador a partir do token de autenticação
        const criadorId = req.user?._id;
        if (!criadorId) {
            throw new Error('ID do criador não encontrado no token.');
        }
        console.log(`ID do criador recebido: ${criadorId}`);

        // Recupera o criador do banco de dados
        const criador = await User.findById(criadorId, '-senha');
        if (!criador) {
            throw new Error('Criador não encontrado no banco de dados.');
        }
        console.log(`Criador encontrado: ${criador.nome}`);

        // Verifica se o usuário já possui um grupo criado
        const grupoExistente = await GrupoAtividades.findOne({ 'criador.id': criadorId });
        
        // Se um grupo já existir, verifica a data
        if (grupoExistente) {
            // Se a data do grupo existente for igual ou posterior a hoje, não permite nova criação
            if (grupoExistente.dataCriacao >= new Date(new Date().setHours(0, 0, 0, 0))) {
                return res.status(400).json({ msg: 'Você já possui um grupo criado hoje. Aguarde antes de criar um novo grupo.' });
            } else {
                // Caso contrário, exclui o grupo existente
                await GrupoAtividades.deleteOne({ _id: grupoExistente._id });
                console.log(`Grupo existente excluído: ${grupoExistente._id}`);
            }
        }

        // Extrair as categorias de erros do usuário
        const categorias = Object.keys(criador.erros || {});
        if (!categorias || categorias.length === 0) {
            throw new Error('Nenhuma categoria encontrada no campo "erros" do usuário.');
        }
        console.log(`Categorias encontradas: ${categorias}`);

        // Selecionar atividades baseadas nos marcos das categorias
        const savedAtividades = [];
        const criadorContagem = {};

        for (const categoria of categorias) {
            console.log(`Processando categoria: ${categoria}`);

            // Recuperar os marcos específicos para esta categoria
            const marcos = criador.erros[categoria];
            for (const marco of marcos) {
                // Busca as atividades disponíveis no banco com base nos marcos
                const atividadesDisponiveis = await Atividades.find({ marco });
                if (!atividadesDisponiveis || atividadesDisponiveis.length === 0) {
                    console.log(`Nenhuma atividade disponível para o marco: ${marco}`);
                    continue;
                }

                const randomIndex = Math.floor(Math.random() * atividadesDisponiveis.length);
                const atividadeSelecionada = atividadesDisponiveis[randomIndex];

                if (!atividadeSelecionada) {
                    console.log(`Nenhuma atividade foi selecionada para o marco: ${marco}`);
                    continue;
                }

                // Verifica se o usuário já completou a atividade
                const atividadeJaFeita = await GruposDeAtividadesFinalizadas.findOne({
                    atividade_id: atividadeSelecionada._id,
                    idDoPaciente: criadorId
                });
                if (!atividadeJaFeita) {
                    savedAtividades.push(atividadeSelecionada);
                    console.log(`Atividade adicionada ao grupo: ${atividadeSelecionada.nomdeDaAtividade}`);

                    // Contagem de criadores de atividades para imagem
                    const criadorAtividadeId = atividadeSelecionada.criador.id;
                    criadorContagem[criadorAtividadeId] = (criadorContagem[criadorAtividadeId] || 0) + 1;
                }

                // Parar se já temos 5 atividades
                if (savedAtividades.length >= 5) {
                    console.log(`Já existem 5 atividades no grupo. Encerrando seleção.`);
                    break;
                }
            }

            if (savedAtividades.length >= 5) {
                break;
            }
        }

        // Garante que o grupo tenha atividades suficientes
        if (savedAtividades.length < 5) {
            throw new Error('Atividades suficientes para completar o grupo não foram encontradas.');
        }

        // Determina os domínios do grupo e calcula pontuação total
        const dominioSet = new Set();
        let pontuacaoTotalDoGrupo = 0;

        savedAtividades.forEach(a => {
            if (a.dominio) (a.dominio || []).forEach(d => dominioSet.add(d));
            pontuacaoTotalDoGrupo += a.exercicios.reduce((total, exercicio) => total + exercicio.pontuacao, 0);
        });

        const dominio = Array.from(dominioSet);
        console.log(`Domínios adicionados: ${dominio}`);
        console.log(`Pontuação total do grupo: ${pontuacaoTotalDoGrupo}`);

        // Calcula o nome do grupo com base no número de grupos finalizados
        const numGruposFinalizados = await GruposDeAtividadesFinalizadas.countDocuments({ idDoPaciente: criadorId });
        const nomeGrupo = `Treinamento de ${criador.nome}`;
        console.log(`Número de grupos finalizados: ${numGruposFinalizados}`);
        console.log(`Nome do grupo: ${nomeGrupo}`);

        // Nivel da atividade baseado no nível do usuário
        const nivelDaAtividade = criador.nivel;

        // Descrição fixa
        const descricao = `Este grupo foi gerado dinamicamente para atender todas as necessidades do usuário ${criador.nome}. Para um plano de atendimento mais especifico, entre em contato com nossos profissionais.`;

        // Determina a imagem baseado no usuário com mais atividades
        let imagem = '';
        const usuarioComMaisAtividades = Object.keys(criadorContagem).reduce((a, b) => criadorContagem[a] > criadorContagem[b] ? a : b, '');
        const usuarioComMaisAtividadesObj = await User.findById(usuarioComMaisAtividades);
        if (usuarioComMaisAtividadesObj && usuarioComMaisAtividadesObj.foto) {
            imagem = usuarioComMaisAtividadesObj.foto;
        }

        if (!imagem) {
            throw new Error('Nenhuma imagem foi selecionada para o grupo.');
        }

        console.log(`Imagem do grupo selecionada: ${imagem}`);

        // Identificador único para o grupo
        const identificador = `${numGruposFinalizados + 1}_${criadorId}`;

        // Cria o objeto do grupo e salva no banco de dados
        const grupoAtividades = new GrupoAtividades({
            dataCriacao: Date.now(),
            nomeGrupo,
            nivelDaAtividade,
            descricao,
            criador: { id: criadorId, nome: criador.nome },
            dominio,
            atividades: savedAtividades,
            pontuacaoTotalDoGrupo,
            identificador,
            imagem
        });

        await grupoAtividades.save();
        console.log(`Grupo criado com sucesso: ${grupoAtividades._id}`);

        res.status(201).json({ msg: 'Grupo de Atividades criado com sucesso!', grupo: grupoAtividades });

    } catch (error) {
        console.error(`Erro ao criar grupo de atividades: ${error.message}`);
        res.status(500).json({ msg: 'Erro ao criar Grupo de Atividades.', error: error.message });
    }
};

const getGrupoAtividadesAuto = async (req, res) => {
    try {
        // Pega o ID do criador a partir do token de autenticação
        const criadorId = req.user?._id; // Supondo que você armazena o ID do usuário no token

        if (!criadorId) {
            return res.status(400).json({ msg: 'ID do criador não encontrado.' });
        }

        // Busca todos os grupos de atividades que o criador criou
        const gruposAtividades = await GrupoAtividades.find({ 'criador.id': criadorId }).populate('criador atividades');

        // Verifica se foram encontrados grupos
        if (gruposAtividades.length === 0) {
            return res.status(404).json({ msg: 'Nenhum grupo de atividades encontrado.' });
        }

        // Retorna apenas os grupos encontrados
        res.status(200).json(gruposAtividades); // Removendo a chave `gruposAtividades`
    } catch (error) {
        console.error('Erro ao obter grupos de atividades:', error);
        res.status(500).json({ msg: 'Erro ao obter grupos de atividades.' });
    }
};

module.exports = {
    getGrupoAtividades,
    createGrupoAtividades,
    updateGrupoAtividades,
    deleteGrupoAtividades,
    filterGrupoAtividades,
    addExercicioToAtividade,
    filterGrupoAtividadesByNivel,
    createGrupoAtividadesAuto,
    getGrupoAtividadesAuto
};