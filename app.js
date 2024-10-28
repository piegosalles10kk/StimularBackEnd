const express = require('express');
const connectDB = require('./src/config/dbConnect');
const setupSwagger = require('./swagger');
const userRoutes = require('./src/routes/userRoutes');
const atividadeRoutes = require('./src/routes/atividadeRoutes');
const exercicioRoutes = require('./src/routes/exerciciosRoutes');
const grupoAtividadesRoutes = require('./src/routes/grupoAtividadesRoutes');
const atividadeEmAndamentoRoutes = require('./src/routes/atividadeEmAndamentoRoutes');
const atividadeFinalizadaRoutes = require('./src/routes/atividadeFinalizadaRoutes');
const { PORT } = require('./config');

const app = express();

// Config json response
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(atividadeRoutes);
app.use(exercicioRoutes);
app.use(grupoAtividadesRoutes);
app.use(atividadeEmAndamentoRoutes);
app.use(atividadeFinalizadaRoutes);

// Connect to MongoDB
connectDB();

// Connect to Swagger
setupSwagger(app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
