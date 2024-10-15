const express = require('express');
const router = express.Router();
const { getUser, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');

router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);
router.get('/user/:id', checkToken, getUser);
router.put('/user/:id', checkToken, updateUser);
router.delete('/user/:id', checkToken, deleteUser);

module.exports = router;
