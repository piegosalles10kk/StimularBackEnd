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

        const criadorId = req.user?._id;

        if (!criadorId) {
            throw new Error('ID do criador não encontrado no token.');
        }

        console.log(`ID do criador recebido: ${criadorId}`);

        const criador = await User.findById(criadorId, '-senha');

        if (!criador) {
            throw new Error('Criador não encontrado no banco de dados.');
        }

        console.log(`Criador encontrado: ${criador.nome} tipo de conta: ${criador.tipoDeConta}`);

        if (criador.tipoDeConta !== 'Paciente') {
            res.status(500).json({ msg: 'Apenas pacientes podem criar atividades.' });
            return;
        } else {
            const grupoExistente = await GrupoAtividades.findOne({ 'criador.id': criadorId });

            if (grupoExistente) {
                if (grupoExistente.dataCriacao >= new Date(new Date().setHours(0, 0, 0, 0))) {
                    return res.status(400).json({ msg: 'Você já possui um grupo criado hoje. Aguarde antes de criar um novo grupo.' });
                } else {
                    await GrupoAtividades.deleteOne({ _id: grupoExistente._id });
                    console.log(`Grupo existente excluído: ${grupoExistente._id}`);
                }
            }

            const categorias = Object.keys(criador.erros || {});

            if (!categorias.length) {
                throw new Error('Nenhuma categoria encontrada no campo "erros" do usuário.');
            }

            console.log(`Categorias encontradas: ${categorias}`);

            const savedAtividades = [];
            const atividadesPorCategoria = {};
            const criadorContagem = {}; // Inicializando criadorContagem

            // Bloco de código para processar categorias
            for (const categoria of categorias) {
                console.log(`Processando categoria: ${categoria}`);
                const marcos = criador.erros[categoria];

                if (!marcos || marcos.length === 0) {
                    console.log(`Nenhum marco encontrado para a categoria: ${categoria}`);
                    continue; // Se não houver marcos, continue para a próxima categoria
                }

                for (const marco of marcos) {
                    try {
                        const atividadesDisponiveis = await Atividades.find({ marco });
                        if (atividadesDisponiveis.length > 0) {
                            const randomIndex = Math.floor(Math.random() * atividadesDisponiveis.length);
                            const atividadeSelecionada = atividadesDisponiveis[randomIndex];

                            if (!atividadesPorCategoria[categoria]) {
                                atividadesPorCategoria[categoria] = [];
                            }
                            atividadesPorCategoria[categoria].push(atividadeSelecionada);
                        } else {
                            console.log(`Nenhuma atividade encontrada para o marco: ${marco}`);
                        }
                    } catch (error) {
                        console.error(`Erro ao buscar atividades para o marco ${marco}: ${error.message}`);
                    }
                }
            }
                      

            // Se não foram adicionadas atividades após o processamento de todas as categorias
            if (savedAtividades.length === 0 && Object.values(atividadesPorCategoria).every(arr => arr.length === 0)) {
                return res.status(404).json({ msg: 'Não há atividades disponíveis.' });
            }

            // Lógica para adicionar atividades ao grupo, mantendo as anteriores
            for (const categoria of categorias) {
                if (atividadesPorCategoria[categoria] && atividadesPorCategoria[categoria].length > 0) {
                    const randomIndex = Math.floor(Math.random() * atividadesPorCategoria[categoria].length);
                    const atividadeSelecionada = atividadesPorCategoria[categoria][randomIndex];

                    const atividadeJaFeita = await GruposDeAtividadesFinalizadas.findOne({
                        atividade_id: atividadeSelecionada._id,
                        idDoPaciente: criadorId
                    });

                    if (!atividadeJaFeita) {
                        savedAtividades.push(atividadeSelecionada);
                        console.log(`Atividade '${atividadeSelecionada.nomdeDaAtividade}' adicionada ao grupo.`);
                        const criadorAtividadeId = atividadeSelecionada.criador.id;
                        criadorContagem[criadorAtividadeId] = (criadorContagem[criadorAtividadeId] || 0) + 1;
                    }
                }
            }

            const porcentagemMinima = 85;


            // Pega o último item de GruposDeAtividadesFinalizadas
            const gruposFinalizados = await criador.gruposDeAtividadesFinalizadas;
            //console.log(gruposFinalizados);
            const grupoFinalizado = gruposFinalizados[gruposFinalizados.length - 1];  // Pega o último item
            //console.log(grupoFinalizado);
            
            

            if (grupoFinalizado) {
                for (const resposta of grupoFinalizado.respostasFinais) {
                    if (resposta.porcentagem < porcentagemMinima) {
                        const novaAtividade = await Atividades.findById(resposta.atividade_id);
                        const tipoDeAtividadeRefazer = novaAtividade.tipoDeAtividade;

                        
                        
            
                        if (novaAtividade) {
                            // Verificar se já existe uma atividade com o mesmo tipoDeAtividade
                            const index = savedAtividades.findIndex(atividade => atividade.tipoDeAtividade === tipoDeAtividadeRefazer);
                            console.log(index);
                            
                            
                            if (index !== -1) {
                                // Substituir a atividade existente pela nova
                                savedAtividades[index] = novaAtividade;
                                console.log(`Atividade '${novaAtividade.nomdeDaAtividade}' substituída devido à porcentagem abaixo de 85% na atividade '${resposta.atividade_id}'.`);
                            } else {
                                // Adicionar a nova atividade se não existir
                                savedAtividades.push(novaAtividade);
                                console.log(`Atividade '${novaAtividade.nomdeDaAtividade}' adicionada devido à porcentagem abaixo de 85% na atividade '${resposta.atividade_id}'.`);
                            }
                        }
                    }
                }
            }


            while (savedAtividades.length < 5) {
                const indiceAleatorio = Math.floor(Math.random() * categorias.length);
                const categoriaEscolhida = categorias[indiceAleatorio];

                if (atividadesPorCategoria[categoriaEscolhida] && atividadesPorCategoria[categoriaEscolhida].length > 0) {
                    const randomIndex = Math.floor(Math.random() * atividadesPorCategoria[categoriaEscolhida].length);
                    const atividadeSelecionada = atividadesPorCategoria[categoriaEscolhida][randomIndex];

                    const atividadeJaFeita = await GruposDeAtividadesFinalizadas.findOne({
                        atividade_id: atividadeSelecionada._id,
                        idDoPaciente: criadorId
                    });

                    if (!atividadeJaFeita) {
                        savedAtividades.push(atividadeSelecionada);
                        console.log(`Atividade '${atividadeSelecionada.nomdeDaAtividade}' adicionada ao grupo (repetição).`);
                    }
                }
            }

            // Verificação para determinar o usuário com mais atividades
            let usuarioComMaisAtividades = '';

            if (Object.keys(criadorContagem).length > 0) {
                usuarioComMaisAtividades = Object.keys(criadorContagem).reduce((a, b) => criadorContagem[a] > criadorContagem[b] ? a : b, '');
            } else {
                console.log('Nenhum usuário com atividades encontrado.');
            }

            // Verificação adicional
            if (!usuarioComMaisAtividades) {
                throw new Error('Não foi possível determinar o usuário com mais atividades.');
            }

            //Função legado para pegar a imagem do grupo

            //let imagem = '';
            //if (usuarioComMaisAtividades) {
            // const usuarioComMaisAtividadesObj = await User.findById(usuarioComMaisAtividades);
            // if (usuarioComMaisAtividadesObj && usuarioComMaisAtividadesObj.foto) {
            //     imagem = usuarioComMaisAtividadesObj.foto;
            // }
            //  }

            let imagem = criador.foto;

            if (!imagem) {
                throw new Error('Nenhuma imagem foi selecionada para o grupo.');
            }

            console.log(`Imagem do grupo selecionada: ${imagem}`);

            const identificador = `${await GruposDeAtividadesFinalizadas.countDocuments({ idDoPaciente: criadorId }) + 1}_${criadorId}`;

            const grupoAtividades = new GrupoAtividades({
                dataCriacao: Date.now(),
                nomeGrupo: `Treinamento de ${criador.nome.split(' ')[0]}`,
                nivelDaAtividade: criador.nivel,
                descricao: `Plano de treinamento desenvolvido no dia ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} para atender exclusivamente ${criador.nome}. Para acompanhamento profissional, entre em contato com nossos profissionais.`,
                criador: { id: criadorId, nome: criador.nome },
                dominio: ['TEA'],
                atividades: savedAtividades,
                pontuacaoTotalDoGrupo: savedAtividades.reduce((total, a) => total + (a.exercicios ? a.exercicios.reduce((sum, ex) => sum + ex.pontuacao, 0) : 0), 0),
                identificador,
                imagem
            });

            await grupoAtividades.save();

            console.log(`Grupo criado com sucesso: ${grupoAtividades._id} com ${grupoAtividades.pontuacaoTotalDoGrupo} atividades`);

            res.status(201).json({ msg: 'Grupo de Atividades criado com sucesso!', grupo: grupoAtividades });
        }

    } catch (error) {
        console.error(`Erro ao criar grupo de atividades: ${error.message}`);
        res.status(500).json({ msg: 'Erro ao criar Grupo de Atividades.', error: error.message });
    }
};






const getGrupoAtividadesAuto = async (req, res) => {
    try {
        const criadorId = req.user?._id; // Obtendo o ID do criador a partir do token

        if (!criadorId) {
            return res.status(400).json({ msg: 'ID do criador não encontrado.' });
        }

        // Busca todos os grupos de atividades que o criador criou
        const gruposAtividades = await GrupoAtividades.find({ 'criador.id': criadorId })
            .populate('criador atividades');

        // Verifica se foram encontrados grupos
        if (gruposAtividades.length === 0) {
            return res.status(404).json({ msg: 'Nenhum grupo de atividades encontrado.' });
        }

        // Obtém os IDs das atividades finalizadas do usuário (considerando que cada atividade finalizada contém um grupo que já foi finalizado)
        const usuario = await User.findById(criadorId).populate('gruposDeAtividadesFinalizadas');
        const idsAtividadesFinalizadas = usuario.gruposDeAtividadesFinalizadas.map(atividade => atividade.grupoAtividadesId.toString());

        // Filtra as atividades que não foram finalizadas
        const gruposAtividadesFiltrados = gruposAtividades.map(grupo => {
            grupo.atividades = grupo.atividades.filter(atividade => 
                !idsAtividadesFinalizadas.includes(atividade._id.toString()) // Verifica se o ID da atividade não está nos finalizados
            );
            return grupo;
        });

        // Retorna os grupos encontrados
        res.status(200).json({ gruposAtividades: gruposAtividadesFiltrados });

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