const express = require('express');
const { verifyJWT } = require('../midileware/midileware');
const { create_a_workspace, get_workspace, get_all_workspaces } = require('./organization_module');
const router = express.Router();

router.post('/create', verifyJWT, create_a_workspace)
router.get('/', get_all_workspaces)
router.get('/workspace-info', get_workspace)


module.exports = router;
