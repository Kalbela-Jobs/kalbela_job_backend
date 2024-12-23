const express = require('express');
const { apply_jobs } = require('./Apply_jobs/Apply_jobs');
const { save_jobs } = require('./Save_jobs/Save_jobs');
const router = express.Router();

router.post('/apply-job', apply_jobs);
router.post('/save-jobs', save_jobs);


module.exports = router;
