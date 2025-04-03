const { Mural } = require('../models/User');
const { uploadMidia } = require('./uploadMidiaController');

const uploadMural = async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;

        // Remover TODOS os murais antes de criar um novo
        await Mural.deleteMany({}); // Apaga qualquer mural existente

        // Função para formatar a data para o titulo
        const formatDateTituloMidia = () => {
            const date = new Date();
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
            const segundos = String(date.getSeconds()).padStart(2, '0'); // Agora inclui segundos
        
            return `${dia}-${mes}-${ano}-${horas}:${minutos}:${segundos}`;
        };        

        // Capturar o arquivo para upload manual
        const idMidia = `midiaMural${formatDateTituloMidia()}`;
        req.params.id = idMidia;

        // Criando uma Promise para capturar a resposta do uploadMidia
        const midiaResponse = await new Promise((resolve, reject) => {
            const fakeRes = {
                json(data) {
                    resolve(data);
                },
                status(code) {
                    this.statusCode = code;
                    return this;
                }
            };

            uploadMidia(req, fakeRes)
                .catch(err => reject(err));
        });

        if (!midiaResponse || !midiaResponse.url) {
            return res.status(500).json({ message: 'Erro no upload da mídia', error: midiaResponse?.error || 'Erro desconhecido' });
        }

        // Função para formatar a data
        const formatDate = () => {
            const date = new Date();
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
        
            return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
        };

        //console.log(formatDate()); // Exemplo de saída: 03/04/2025 14:30

        // Criando um novo documento do mural
        const novoMural = new Mural({
            autor: "Equipe Stimular", // Autor fixo
            titulo,
            midia: {
                tipoDeMidia: midiaResponse.tipo,
                url: midiaResponse.url,
            },
            conteudo,
            dataCriacao: formatDate(),
        });

        // Salvando no banco de dados
        await novoMural.save();

        return res.status(201).json({ message: 'Mural atualizado com sucesso!', mural: novoMural });

    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar mural.', error: error.message });
    }
};


const verMural = async (req, res) => {
    try {
        // Busca todos os murais no banco de dados
        const murais = await Mural.find();

        // Retorna os murais encontrados
        return res.status(200).json({ murais });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar murais.', error: error.message });
    }
};

module.exports = { uploadMural, verMural };
