const express = require('express');
const router = express.Router();
const { createAtividadeFinalizada, getAtividadeFinalizada, updateAtividadeFinalizada, deleteAtividadeFinalizada } = require('../controllers/atividadeFinalizadaController');
const checkToken = require('../middleware/checkToken');

router.post('/grupoatividades/:grupoAtividadeId/atividadesfinalizadas', checkToken, createAtividadeFinalizada);
router.get('/atividadesfinalizadas/:id', checkToken, getAtividadeFinalizada);
router.patch('/atividadesfinalizadas/:id', checkToken, updateAtividadeFinalizada);
router.delete('/atividadesfinalizadas/:id', checkToken, deleteAtividadeFinalizada);

module.exports = router;
