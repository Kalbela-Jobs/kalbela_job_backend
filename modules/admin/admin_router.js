const express = require('express');
const { get_all_candidates, update_candidate_info } = require('./admin_module/candidate');
const { verifyJWT } = require('../midileware/midileware');
const router = express.Router();

router.get('/get-all-candidate', verifyJWT, get_all_candidates);
router.patch('/update-candidate', verifyJWT, update_candidate_info);

module.exports = router;
