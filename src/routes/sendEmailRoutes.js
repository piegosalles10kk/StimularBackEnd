const express = require('express');
const router = express.Router();
const { sendEmail, verificarCodigo } = require('../controllers/sendEmailController');

router.get('/auth/recover/:email', sendEmail);

router.get('/auth/verify-code/:email/:codigo', verificarCodigo);

module.exports = router;
