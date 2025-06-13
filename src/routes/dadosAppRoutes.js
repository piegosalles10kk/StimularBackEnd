const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const { sendDadosApp, getDadosApp } = require('../controllers/dadosAppController');

router.post('/dadosApp', sendDadosApp);
router.get('/dadosApp', checkToken, getDadosApp);


module.exports = router;