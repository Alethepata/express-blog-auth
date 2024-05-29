const express = require('express');
const router = express.Router();

const { index } = require('../controllers/authController.js')

router.post('/', index);

module.exports = router;