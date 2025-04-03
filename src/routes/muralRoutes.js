const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const { uploadMural, verMural } = require('../controllers/muralController');

router.post('/mural', uploadMural);
router.get('/mural', checkToken, verMural);


module.exports = router;