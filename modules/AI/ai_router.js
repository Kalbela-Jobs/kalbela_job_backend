const express = require('express');
const { generate_job_description } = require('./genarate');
const router = express.Router();

router.post('/generate-job-description', generate_job_description);

module.exports = router;
