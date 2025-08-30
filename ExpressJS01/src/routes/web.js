const express = require('express');
const { getHomepage } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHomepage);

module.exports = router;