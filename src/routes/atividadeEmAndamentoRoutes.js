const express = require('express');
const router = express.Router();
const { createAtividadeEmAndamento, getAtividadeEmAndamento, updateAtividadeEmAndamento, deleteAtividadeEmAndamento } = require('../controllers/atividadeEmAndamentoController');
const checkToken = require('../middleware/checkToken');

router.post('/grupoatividades/:grupoAtividadeId/atividadesemandamento', checkToken, createAtividadeEmAndamento);
router.get('/atividadesemandamento/:id', checkToken, getAtividadeEmAndamento);
router.patch('/atividadesemandamento/:id', checkToken, updateAtividadeEmAndamento);
router.delete('/atividadesemandamento/:id', checkToken, deleteAtividadeEmAndamento);

module.exports = router;
