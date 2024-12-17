const express = require('express');
const { get_category, create_category } = require('./module');
const router = express.Router();

router.get('/', get_category)
router.post('/create', create_category)

module.exports = router;
