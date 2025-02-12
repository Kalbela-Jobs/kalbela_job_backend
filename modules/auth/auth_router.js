const express = require('express');
const { create_a_workspace, create_user, verify_email, regenerate_otp, create_new_hr_and_user, create_user_as_a_job_sucker, sign_up_with_google_for_hr, sign_up_with_google_for_job_sucker } = require('./sign_up/sign_up');
const { sign_in, sign_in_user } = require('./sign_in/sign_in');
const router = express.Router();


router.post('/sign-up', create_user);
router.post('/sign-up-user', create_user_as_a_job_sucker);
router.post('/sign-in', sign_in);
router.post('/signin-user', sign_in_user);
router.post('/verify-email', verify_email);
router.post('/regenerate-otp', regenerate_otp);
router.post('/create-hr', create_new_hr_and_user);
router.post('/sign-in-with-google-hr', sign_up_with_google_for_hr);
router.post('/signin-user-with-google', sign_up_with_google_for_job_sucker);




module.exports = router;
