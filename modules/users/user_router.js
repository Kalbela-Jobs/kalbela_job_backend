const express = require('express');
const { apply_jobs } = require('./Apply_jobs/Apply_jobs');
const { save_jobs } = require('./Save_jobs/Save_jobs');
const { update_profile_data } = require('./update/update_profile');
const { upload_resume, get_resume } = require('./Resume/Resume');
const router = express.Router();

router.post('/apply-job', apply_jobs);
router.post('/save-jobs', save_jobs);
router.put('/update-profile', update_profile_data)
router.post('/upload-resume', upload_resume)
router.get('/get-resume', get_resume)


module.exports = router;
