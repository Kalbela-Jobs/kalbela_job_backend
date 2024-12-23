const express = require('express');
const router = express.Router();
const { get_all_jobs, get_job_search_result, update_job, create_job, delete_job, get_workspace_jobs, get_search_suggestions } = require('./job_module');



router.get('/', get_job_search_result)
router.post('/create', create_job)
router.put('/update', update_job)
router.delete('/delete', delete_job)
router.get('/workspace-jobs', get_workspace_jobs)
router.post('/search', get_all_jobs)
router.get('/get-suggestions', get_search_suggestions)

module.exports = router;
