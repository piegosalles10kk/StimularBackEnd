const express = require('express');
const router = express.Router();
const { addExercicioToAtividade, getExercicio, updateExercicio, deleteExercicio } = require('../controllers/exercicioController');
const checkToken = require('../middleware/checkToken');

router.patch('/grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios', checkToken, addExercicioToAtividade);
router.get('/grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId', checkToken, getExercicio);
router.patch('/grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId', checkToken, updateExercicio);
router.delete('/grupoatividades/:grupoAtividadeId/atividades/:atividadeId/exercicios/:exercicioId', checkToken, deleteExercicio);

module.exports = router;
