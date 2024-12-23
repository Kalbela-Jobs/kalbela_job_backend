const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../midileware/midileware');
const { create_a_workspace, get_workspace, get_all_workspaces, update_workspace } = require('./organization_module');
const { create_new_hr_and_user } = require('../auth/sign_up/sign_up');


router.post('/create', verifyJWT, create_a_workspace)
router.get('/', get_all_workspaces)
router.get('/workspace-info', get_workspace)
router.patch('/update', verifyJWT, update_workspace)
router.post('/create-hr', verifyJWT, create_new_hr_and_user)


module.exports = router;
