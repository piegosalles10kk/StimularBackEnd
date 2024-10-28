const { PORT } = require('./config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentação da API',
            version: '1.0.0',
            description: 'Documentação da API para gerenciamento de Stimular.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, 
            },
        ],
    },
    apis: ['./routes/*.js', './src/docs/swaggerDocumentation.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
