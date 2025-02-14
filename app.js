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
const atividadesApp = require('./src/routes/atividadeAppRoutes');
const { PORT } = require('./config');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

// Config json response
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(upload.single('file')); // Para analisar multipart/form-data

// Routes
app.use(userRoutes);
app.use(atividadeRoutes);
app.use(exercicioRoutes);
app.use(grupoAtividadesRoutes);
app.use(atividadeEmAndamentoRoutes);
app.use(atividadeFinalizadaRoutes);
app.use(uploadMidia);
app.use(sendEmailRoutes);
app.use(atividadesApp);

// Connect to MongoDB
connectDB();

// Connect to Swagger
setupSwagger(app);

app.listen(port, () => console.log(`Server running on port ${port}`));
