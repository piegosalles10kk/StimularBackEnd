const multer = require('multer');
const { AtualizacoesApp, TarefasAtualizacao } = require('../models/User'); 
const upload = multer();

const formatDate = () => {
    const date = new Date();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`; // Retorna a data no formato dd/mm/yyyy
};

const enviarAtualizacoes = async (req, res) => {
    try {
        const { tituloAtualizacao, tarefas, descricaoAtualizacao } = req.body;

        // Validação básica
        if (!tituloAtualizacao || !descricaoAtualizacao || !tarefas || !Array.isArray(tarefas)) {
            return res.status(400).json({ error: 'Dados de atualização incompletos.' });
        }

        // Criar nova atualização no banco de dados
        const novaAtualizacao = new AtualizacoesApp({
            tituloAtualizacao,
            descricaoAtualizacao,
            tarefas: tarefas.map(tarefa => ({
                ...tarefa,
                dataCriacao: new Date(), // Define a data de criação das tarefas
            })),
            dataCriacao: new Date(),
            finalizada: false, // Valor padrão
        });

        await novaAtualizacao.save();

        return res.status(201).json({
            message: "Atualização enviada com sucesso.",
            data: novaAtualizacao
        });
    } catch (error) {
        console.error('Erro ao enviar atualizações:', error);
        return res.status(500).json({ error: 'Erro ao enviar atualizações.' });
    }
};

const lerAtualizacoes = async (req, res) => {
    try {
        const atualizacoes = await AtualizacoesApp.find();
        return res.status(200).json(atualizacoes);
    } catch (error) {
        console.error('Erro ao ler atualizações:', error);
        return res.status(500).json({ error: 'Erro ao ler atualizações.' });
    }
};

const editarAtualizacoes = async (req, res) => {
    const { id } = req.params;
    const { tituloAtualizacao, tarefas, descricaoAtualizacao, finalizada } = req.body;

    try {
        const atualizacao = await AtualizacoesApp.findById(id);
        if (!atualizacao) {
            return res.status(404).json({ error: 'Atualização não encontrada.' });
        }

        // Atualiza os campos conforme recebido
        atualizacao.tituloAtualizacao = tituloAtualizacao || atualizacao.tituloAtualizacao;
        atualizacao.descricaoAtualizacao = descricaoAtualizacao || atualizacao.descricaoAtualizacao;
        
        // Atualiza tarefas se forem fornecidas
        if (tarefas) {
            // Mapeia as novas tarefas, preservando a original se o id da tarefa não for novo
            atualizacao.tarefas = tarefas.map(tarefa => ({
                ...tarefa,
                dataCriacao: tarefa.dataCriacao || new Date(), // Define a data somente se não houver
            }));
        }

        atualizacao.finalizada = finalizada !== undefined ? finalizada : atualizacao.finalizada; // Atualiza o status apenas se um valor foi passado

        await atualizacao.save();

        return res.status(200).json({
            message: "Atualização editada com sucesso.",
            data: atualizacao
        });
    } catch (error) {
        console.error('Erro ao editar atualização:', error);
        return res.status(500).json({ error: 'Erro ao editar atualização.' });
    }
};

const apagarAtualizacoes = async (req, res) => {
    const { id } = req.params;

    try {
        const atualizacao = await AtualizacoesApp.findByIdAndDelete(id);
        if (!atualizacao) {
            return res.status(404).json({ error: 'Atualização não encontrada.' });
        }

        return res.status(200).json({ message: 'Atualização apagada com sucesso.' });
    } catch (error) {
        console.error('Erro ao apagar atualização:', error);
        return res.status(500).json({ error: 'Erro ao apagar atualização.' });
    }
};

module.exports = { enviarAtualizacoes, lerAtualizacoes, editarAtualizacoes, apagarAtualizacoes };
