const express = require('express');
const router = express.Router();
const { getUser, getAllUser, createUser, updateUser, deleteUser, loginUser, updateUserMoeda } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');

router.post('/auth/register', createUser);

router.post('/auth/login', loginUser);

router.get('/user', getAllUser);

router.get('/user/:id', checkToken, getUser);

router.put('/user/:id', checkToken, updateUser);

router.delete('/user/:id', checkToken, deleteUser);

router.patch('/users/:id/moeda', checkToken, updateUserMoeda);

module.exports = router;