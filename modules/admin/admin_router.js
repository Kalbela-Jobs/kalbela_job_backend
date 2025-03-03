const express = require('express');
const { get_all_candidates } = require('./admin_module/candidate');
const { verifyJWT } = require('../midileware/midileware');
const router = express.Router();

router.get('/get-all-candidate', verifyJWT, get_all_candidates);

module.exports = router;
