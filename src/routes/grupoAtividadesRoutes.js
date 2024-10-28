const express = require('express');
const router = express.Router();
const { getGrupoAtividades, createGrupoAtividades, updateGrupoAtividades, deleteGrupoAtividades, filterGrupoAtividades, addExercicioToAtividade } = require('../controllers/grupoAtividadesController');
const checkToken = require('../middleware/checkToken');

router.post('/grupoatividades', checkToken, createGrupoAtividades);
router.get('/grupoatividades/:id', checkToken, getGrupoAtividades);
router.put('/grupoatividades/:id', checkToken, updateGrupoAtividades);
router.delete('/grupoatividades/:id', checkToken, deleteGrupoAtividades);
router.get('/grupoatividades', checkToken, filterGrupoAtividades);
router.patch('/atividades/:atividadeId/exercicios', checkToken, addExercicioToAtividade);

module.exports = router;
