const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');
const upload = multer();

const uploadMidia = async (req, res) => {
    console.log('Iniciando uploadMidia');
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient('midias');
    let filename;
    let tipoArquivo;

    console.log('Requisição recebida:', req.body, req.file);

    if (req.file) {
        console.log('Arquivo recebido:', req.file);
        let file = req.file;
        tipoArquivo = file.mimetype;
        filename = uuid.v4().toString() + path.extname(file.originalname);
        console.log('Tipo de arquivo:', tipoArquivo);
        console.log('Nome do arquivo:', filename);

        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        try {
            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { blobContentType: tipoArquivo }
            });
            console.log('Arquivo enviado com sucesso:', filename);
        } catch (error) {
            console.error("Erro ao enviar o arquivo para o Azure Blob Storage:", error);
            return res.status(500).json({ error: 'Upload failed' });
        }

        const token = process.env.TOKEN; // Certifique-se de que o token está configurado no seu ambiente
        return res.status(201).json({ url: `https://stimularmidias.blob.core.windows.net/midias/${filename}${token}`, tipo: tipoArquivo });
    }

    if (req.body.image) {
        console.log('Imagem em base64 recebida:', req.body.image);
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!matches) {
            console.error('Dados da imagem inválidos');
            return res.status(400).json({ error: 'Invalid image data' });
        }

        let type = matches[1];
        let extension = getExtension(type);
        tipoArquivo = type;
        console.log('Tipo de imagem:', type);
        console.log('Extensão do arquivo:', extension);

        if (!extension) {
            console.error('Tipo de arquivo não suportado');
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        filename = uuid.v4().toString() + extension;
        let buffer = Buffer.from(matches[2], 'base64');

        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        try {
            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: tipoArquivo }
            });
            console.log('Imagem enviada com sucesso:', filename);
        } catch (error) {
            console.error("Erro ao enviar a imagem para o Azure Blob Storage:", error);
            return res.status(500).json({ error: 'Upload failed' });
        }

        const token = process.env.TOKEN; // Certifique-se de que o token está configurado no seu ambiente
        return res.status(201).json({ url: `https://stimularmidias.blob.core.windows.net/midias/${filename}`, tipo: tipoArquivo });
    }

    console.error('Nenhum arquivo ou dados de imagem fornecidos');
    return res.status(400).json({ error: 'No file or image data provided' });
};

function getExtension(mimeType) {
    console.log('Obtendo extensão para MIME type:', mimeType);
    switch (mimeType) {
        case 'image/png':
            return '.png';
        case 'image/jpeg':
            return '.jpeg';
        case 'image/gif':
            return '.gif';
        case 'video/mp4':
            return '.mp4';
        case 'video/avi':
            return '.avi';
        case 'video/mpeg':
            return '.mpeg';
        default:
            console.error('MIME type não suportado:', mimeType);
            return null;
    }
}

module.exports = {
    uploadMidia
};
