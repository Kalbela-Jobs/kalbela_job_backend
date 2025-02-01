const express = require('express');
const router = express.Router();
const { get_all_jobs, get_job_search_result, update_job, create_job, delete_job, get_workspace_jobs, get_search_suggestions, get_job_info_by_id, org_all_jobs_with_info, get_featured_jobs } = require('./job_module');
const { create_govt_jobs, get_all_govt_jobs, delete_govt_jobs, get_govt_job_suggestions_by_org, get_single_govt_jobs, get_all_govt_org_and_jobs } = require('./govt_jobs_module');



router.get('/', get_job_search_result)
router.get('/get-by-url', get_job_info_by_id)
router.post('/create', create_job)
router.put('/update', update_job)
router.delete('/delete', delete_job)
router.get('/workspace-jobs', get_workspace_jobs)
// router.post('/search', get_all_jobs)
router.get('/get-suggestions', get_search_suggestions)
router.get('/organization-jobs', org_all_jobs_with_info)
router.get('/get-featured-jobs', get_featured_jobs)
router.get('/get-all-jobs', get_all_jobs)

router.get('/get-single-govt-job', get_single_govt_jobs)
router.post('/create-govt-jobs', create_govt_jobs)
router.get('/get-all-govt-jobs', get_all_govt_jobs)
router.delete('/delete-govt-jobs', delete_govt_jobs)
router.get('/get-govt-suggestions-by-org', get_govt_job_suggestions_by_org)
router.get('/get-all-org-jobs', get_all_govt_org_and_jobs)



module.exports = router;
