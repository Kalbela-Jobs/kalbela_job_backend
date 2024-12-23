const express = require('express');
const { get_category, create_category, get_all_jobs, create_job_type, update_job_type } = require('./module');
const router = express.Router();

router.get('/', get_all_jobs)
router.post('/create', create_job_type)
router.patch('/update', update_job_type)

module.exports = router;
