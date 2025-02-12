const express = require('express');
const router = express.Router();

const { get_all_candidates, get_single_candidate, update_candidate_status, get_candidate_by_job } = require('./candidate/candidate');

router.get('/candidates', get_all_candidates)
router.get('/candidate', get_single_candidate)
router.put('/update', update_candidate_status)
router.get('/candidate-by-job', get_candidate_by_job)


module.exports = router;
