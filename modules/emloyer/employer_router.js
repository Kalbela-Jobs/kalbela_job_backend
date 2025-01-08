const express = require('express');
const router = express.Router();

const { get_all_candidates } = require('./candidate/candidate');

router.get('/candidates', get_all_candidates)

module.exports = router;
