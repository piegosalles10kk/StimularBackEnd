const { Mural } = require('../models/User');
const { uploadMidia } = require('./uploadMidiaController');

const uploadMural = async (req, res) => {
    try {
        const { autor, titulo, conteudo } = req.body;

        // Remover mural antigo antes de criar um novo
        await Mural.deleteMany({ autor }); // Apaga qualquer mural com esse autor

        // Capturar o arquivo para upload manual
        const idMidia = "midiaMural";
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

        // Criando um novo documento do mural
        const novoMural = new Mural({
            autor,
            titulo,
            midia: {
                tipoDeMidia: midiaResponse.tipo,
                url: midiaResponse.url,
            },
            conteudo,
            dataCriacao: new Date().toISOString(),
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
