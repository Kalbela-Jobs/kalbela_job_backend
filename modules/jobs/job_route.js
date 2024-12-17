const express = require('express');
const router = express.Router();
const { get_all_jobs, get_job_search_result, update_job, create_job, delete_job } = require('./job_module');



router.get('/', get_job_search_result)
router.post('/create', create_job)
router.put('/update/:job_id', update_job)
router.delete('/delete/:job_id', delete_job)

module.exports = router;
