const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../midileware/midileware');
const { create_a_workspace, get_workspace, get_all_workspaces, update_workspace, get_feature_org, delete_organization } = require('./organization_module');
const { create_new_hr_and_user, get_workspace_hr } = require('../auth/sign_up/sign_up');


router.post('/create', verifyJWT, create_a_workspace)
router.get('/', get_all_workspaces)
router.get('/feature', get_feature_org)
router.get('/workspace-info', get_workspace)
router.patch('/update', verifyJWT, update_workspace)
router.post('/create-hr', verifyJWT, create_new_hr_and_user)
router.get('/workspace-hr', get_workspace_hr)
router.delete('/delete', verifyJWT, delete_organization)


module.exports = router;
