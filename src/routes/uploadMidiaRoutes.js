const express = require('express');
const router = express.Router();
const { uploadMidia } = require('../controllers/uploadMidiaController');
const checkToken = require('../middleware/checkToken');

router.post('/midia/post', uploadMidia);


module.exports = router;