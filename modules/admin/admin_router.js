const express = require('express');
const { get_all_candidates, update_candidate_info, delete_candidate } = require('./admin_module/candidate');
const { verifyAdmin } = require('../midileware/midileware');
const { create_new_workspace_user, delete_workspace_staff } = require('./admin_module/create_user');
const router = express.Router();

router.get('/get-all-candidate', verifyAdmin, get_all_candidates);
router.patch('/update-candidate', verifyAdmin, update_candidate_info);
router.delete('/delete-candidate', verifyAdmin, delete_candidate);
router.patch('/create-hr-account', verifyAdmin, create_new_workspace_user)
router.delete('/delete-hr-account', verifyAdmin, delete_workspace_staff)


module.exports = router;
