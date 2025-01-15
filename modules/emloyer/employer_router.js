const express = require('express');
const router = express.Router();

const { get_all_candidates, get_single_candidate, update_candidate_status } = require('./candidate/candidate');

router.get('/candidates', get_all_candidates)
router.get('/candidate', get_single_candidate)
router.put('/update', update_candidate_status)

module.exports = router;
