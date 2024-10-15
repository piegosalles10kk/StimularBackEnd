const express = require('express');
const router = express.Router();
const {
    createAtividadeCriada,
    getAtividadesCriadas,
    getAtividadesCriadasFiltradas,
    getAtividadesCriadasFiltradasAutor,
    updateAtividadeCriada,
    deleteAtividadeCriada,
    createAtividadeFinalizada,
    getAtividadesFinalizadas,
    updateAtividadeFinalizada,
    deleteAtividadeFinalizada,
    createAtividadeEmAndamento,
    getAtividadeEmAndamento,
    updateAtividadeEmAndamento,
    deleteAtividadeEmAndamento
} = require('../controllers/atividadeController');
const checkToken = require('../middleware/checkToken');

// Rotas para atividadesCriadas
router.post('/user/:id/atividadesCriadas', checkToken, createAtividadeCriada);
router.get('/atividadesCriadas', checkToken, getAtividadesCriadas);
router.get('/atividadesCriadasFiltradas/:id', checkToken, getAtividadesCriadasFiltradas); // Nova rota para atividades filtradas por grupo e autor
router.get('/atividadesCriadasFiltradasAutor/:id', checkToken, getAtividadesCriadasFiltradasAutor); // Nova rota para atividades filtradas por autor
router.put('/atividadesCriadas/:id', checkToken, updateAtividadeCriada);
router.delete('/atividadesCriadas/:id', checkToken, deleteAtividadeCriada);

// Rotas para atividadeFinalizada
router.post('/user/:id/atividadeFinalizada', checkToken, createAtividadeFinalizada);
router.get('/user/:id/atividadeFinalizada', checkToken, getAtividadesFinalizadas);
router.put('/user/:id/atividadeFinalizada/:atividadeId', checkToken, updateAtividadeFinalizada);
router.delete('/user/:id/atividadeFinalizada/:atividadeId', checkToken, deleteAtividadeFinalizada);

// Rotas para atividadeEmAndamento
router.post('/user/:id/atividadeEmAndamento', checkToken, createAtividadeEmAndamento);
router.get('/user/:id/atividadeEmAndamento', checkToken, getAtividadeEmAndamento);
router.put('/user/:id/atividadeEmAndamento', checkToken, updateAtividadeEmAndamento);
router.delete('/user/:id/atividadeEmAndamento', checkToken, deleteAtividadeEmAndamento);

module.exports = router;
