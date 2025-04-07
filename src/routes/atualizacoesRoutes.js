const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const { enviarAtualizacoes, lerAtualizacoes, editarAtualizacoes, apagarAtualizacoes } = require('../controllers/atualizacoesController');


router.post('/atualizacoes', enviarAtualizacoes);
router.get('/atualizacoes', lerAtualizacoes);
router.put('/atualizacoes/:id', editarAtualizacoes);
router.delete('/atualizacoes/:id', apagarAtualizacoes);


module.exports = router;