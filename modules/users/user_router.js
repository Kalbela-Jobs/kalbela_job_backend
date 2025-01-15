const express = require('express');
const { apply_jobs, get_applied_jobs } = require('./Apply_jobs/Apply_jobs');
const { save_jobs, get_saved_jobs } = require('./Save_jobs/Save_jobs');
const { update_profile_data } = require('./update/update_profile');
const { upload_resume, get_resume, delete_resume } = require('./Resume/Resume');
const { upload_education, get_education, delete_education, update_education } = require('./education/education');
const { post_certification, get_certification, delete_certification, update_certification } = require('./certifiaction/certification');
const { update_user_skill, get_user_skill } = require('./skills/skill');
const { upload_experience, get_experience, delete_experience, update_experience } = require('./experiace/experiance');
const router = express.Router();

router.post('/apply-job', apply_jobs);
router.get('/get-applied-jobs', get_applied_jobs);
router.post('/save-jobs', save_jobs);
router.get('/get-saved-jobs', get_saved_jobs);
router.put('/update-profile', update_profile_data)
router.post('/upload-resume', upload_resume)
router.get('/get-resume', get_resume)
router.delete('/delete-resume', delete_resume)
router.post('/upload-education', upload_education)
router.get('/get-education', get_education)
router.delete('/delete-education', delete_education)
router.patch('/update-education', update_education)
router.post('/upload-certification', post_certification)
router.get('/get-certification', get_certification)
router.delete('/delete-certification', delete_certification)
router.patch('/update-certification', update_certification)
router.put('/update-skill', update_user_skill)
router.get('/get-skills', get_user_skill)
router.post('/upload-experience', upload_experience)
router.get('/get-experience', get_experience)
router.delete('/delete-experience', delete_experience)
router.patch('/update-experience', update_experience)









module.exports = router;
