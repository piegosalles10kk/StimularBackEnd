const express = require('express');
const router = express.Router();
const { getUser, getAllUser, createUser, updateUser, deleteUser, loginUser, updateUserMoeda, updatePasswordRecovery, updatePassword, getAllUserAtivos, AtivoOuInativo, getAllUserAtivosPacientes } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');

router.post('/auth/register', createUser);

router.post('/auth/login', loginUser);

router.put('/auth/update-password-recovery', updatePasswordRecovery);

router.put('/auth/update-password/:id', checkToken, updatePassword);

router.get('/user', getAllUser);

router.get('/user-ativos', checkToken, getAllUserAtivos);

router.get('/user-ativos-paciente', checkToken, getAllUserAtivosPacientes);

router.put('/usuario/status/:id', checkToken, AtivoOuInativo);

router.get('/user/:id', checkToken, getUser);

router.put('/user/:id', checkToken, updateUser);

router.delete('/user/:id', checkToken, deleteUser);

router.patch('/users/:id/moeda', checkToken, updateUserMoeda);



module.exports = router;