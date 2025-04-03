const { Mural } = require('../models/User');
const { uploadMidia } = require('./uploadMidiaController');

const uploadMural = async (req, res) => {
    try {
        const { titulo, conteudo, autor } = req.body;

        // ✅ Buscar o último mural antes de deletar todos
        const ultimoMural = await Mural.findOne().sort({ dataCriacao: -1 });

        // ✅ Função para formatar a data para o título
        const formatDateTituloMidia = () => {
            const date = new Date();
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
            const segundos = String(date.getSeconds()).padStart(2, '0');

            return `${dia}-${mes}-${ano}-${horas}:${minutos}:${segundos}`;
        };

        // Capturar o arquivo para upload manual
        const idMidia = `midiaMural${formatDateTituloMidia()}`;
        req.params.id = idMidia;

        // ✅ Criando uma Promise para capturar a resposta do uploadMidia
        let midiaResponse = null;
        try {
            midiaResponse = await new Promise((resolve, reject) => {
                const fakeRes = {
                    json(data) { resolve(data); },
                    status(code) { this.statusCode = code; return this; }
                };

                uploadMidia(req, fakeRes).catch(err => reject(err));
            });
        } catch (error) {
            console.error("Erro no upload da mídia:", error);
        }

        // ✅ Se não houver nova mídia, usa a do último mural armazenado
        const midia = midiaResponse?.url
            ? { tipoDeMidia: midiaResponse.tipo, url: midiaResponse.url }
            : ultimoMural?.midia
            ? { tipoDeMidia: ultimoMural.midia.tipoDeMidia, url: ultimoMural.midia.url }
            : { tipoDeMidia: null, url: null };

        // ✅ Remover TODOS os murais antigos após validação
        await Mural.deleteMany({}); 

        // ✅ Função para formatar a data
        const formatDate = () => {
            const date = new Date();
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');

            return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
        };

        // ✅ Criando um novo documento do mural
        const novoMural = new Mural({
            autor: autor?.trim() ? autor : "Equipe Stimular", 
            titulo,
            midia,
            conteudo,
            dataCriacao: formatDate(),
        });

        // ✅ Salvando no banco de dados
        await novoMural.save();

        return res.status(201).json({ message: "Mural atualizado com sucesso!", mural: novoMural });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar mural.", error: error.message });
    }
};

const verMural = async (req, res) => {
    try {
        const murais = await Mural.find();
        return res.status(200).json({ murais });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar murais.", error: error.message });
    }
};

module.exports = { uploadMural, verMural };
