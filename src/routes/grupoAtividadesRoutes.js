const express = require('express');
const router = express.Router();
const { getGrupoAtividades, createGrupoAtividades, updateGrupoAtividades, deleteGrupoAtividades, filterGrupoAtividades, addExercicioToAtividade, filterGrupoAtividadesByNivel, createGrupoAtividadesAuto, getGrupoAtividadesAuto } = require('../controllers/grupoAtividadesController');
const checkToken = require('../middleware/checkToken');

router.post('/grupoatividades', checkToken, createGrupoAtividades);
router.post('/grupoatividadesAuto', checkToken, createGrupoAtividadesAuto);
router.get('/grupoatividadesAuto', checkToken, getGrupoAtividadesAuto);
router.get('/grupoatividades', filterGrupoAtividades);
router.get('/grupoatividades/:id', checkToken, getGrupoAtividades);
router.put('/grupoatividades/:id', checkToken, updateGrupoAtividades);
router.patch('/grupoatividades/:id', checkToken, updateGrupoAtividades);
router.delete('/grupoatividades/:id', checkToken, deleteGrupoAtividades);
router.patch('/atividades/:atividadeId/exercicios', checkToken, addExercicioToAtividade);
router.get('/grupos-atividades/nivel', checkToken, filterGrupoAtividadesByNivel);

module.exports = router;
