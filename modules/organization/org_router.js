const express = require('express');
const { verifyJWT } = require('../midileware/midileware');
const { create_a_workspace } = require('./organization_module');
const router = express.Router();

router.post('/create', verifyJWT, create_a_workspace)

module.exports = router;
