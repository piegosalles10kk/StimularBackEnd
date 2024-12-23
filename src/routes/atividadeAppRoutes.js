const express = require('express');
const {
    addAtividade,
    getAtividades,
    getAtividade,
    updateAtividade,
    deleteAtividade,
} = require('../controllers/atividadeAppController');
const checkToken = require('../middleware/checkToken');

const router = express.Router();

// Rotas para atividades
router.post('/atividadeApp',checkToken, addAtividade); // Criar uma nova atividade
router.get('/atividadeApp',checkToken, getAtividades); // Obter todas as atividades
router.get('/atividadeApp/:atividadeId',checkToken, getAtividade); // Obter uma atividade específica
router.put('/atividadeApp/:atividadeId',checkToken, updateAtividade); // Atualizar uma atividade
router.delete('/atividadeApp/:atividadeId',checkToken, deleteAtividade); // Deletar uma atividade

module.exports = router;
