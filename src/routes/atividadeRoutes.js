const express = require('express');
const router = express.Router();
const { createAtividade, getAtividade, updateAtividade, deleteAtividade } = require('../controllers/atividadeController');
const checkToken = require('../middleware/checkToken');

router.post('/grupoatividades/:grupoAtividadeId/atividades', checkToken, createAtividade);
router.get('/atividades/:id', checkToken, getAtividade);
router.patch('/atividades/:id', checkToken, updateAtividade);
router.delete('/atividades/:id', checkToken, deleteAtividade);

module.exports = router;
