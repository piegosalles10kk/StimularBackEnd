const express = require('express');
const connectDB = require('./src/config/dbConnect');
const setupSwagger = require('./swagger');
const cors = require('cors');
const multer = require('multer'); 
const upload = multer();
const userRoutes = require('./src/routes/userRoutes');
const atividadeRoutes = require('./src/routes/atividadeRoutes');
const exercicioRoutes = require('./src/routes/exerciciosRoutes');
const grupoAtividadesRoutes = require('./src/routes/grupoAtividadesRoutes');
const atividadeEmAndamentoRoutes = require('./src/routes/atividadeEmAndamentoRoutes');
const atividadeFinalizadaRoutes = require('./src/routes/atividadeFinalizadaRoutes');
const uploadMidia = require('./src/routes/uploadMidiaRoutes');
const sendEmailRoutes = require('./src/routes/sendEmailRoutes');
const atividadesAppRoutes = require('./src/routes/atividadeAppRoutes');
const muralRoutes = require('./src/routes/muralRoutes');
const dadosAppRoutes = require('./src/routes/dadosAppRoutes');
const atualizacoesRoutes = require('./src/routes/atualizacoesRoutes');
const { PORT } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configuração para JSON e URL-encoded
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(upload.single('file')); // Para análise de multipart/form-data

// Rota principal
app.get('/', (req, res) => {
    res.send('ApiStimularOn');
});

// Rotas da aplicação
app.use(userRoutes);
app.use(atividadeRoutes);
app.use(exercicioRoutes);
app.use(grupoAtividadesRoutes);
app.use(atividadeEmAndamentoRoutes);
app.use(atividadeFinalizadaRoutes);
app.use(uploadMidia);
app.use(sendEmailRoutes);
app.use(muralRoutes);
app.use(atividadesAppRoutes);
app.use(dadosAppRoutes);
app.use(atualizacoesRoutes);

// Conexão ao banco de dados
connectDB();

// Configuração do Swagger
setupSwagger(app);

// Inicialização do servidor
app.listen(port, () => console.log(`Server running on port ${port}`));
