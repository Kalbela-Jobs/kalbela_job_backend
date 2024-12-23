const express = require('express');
const { create_a_workspace, create_user, verify_email, regenerate_otp, create_new_hr_and_user } = require('./sign_up/sign_up');
const { sign_in, sign_out } = require('./sign_in/sign_in');
const router = express.Router();


router.post('/sign-up', create_user);
router.post('/sign-in', sign_in);
router.post('/sign-out', sign_out);
router.post('/verify-email', verify_email);
router.post('/regenerate-otp', regenerate_otp);
router.post('/create-hr', create_new_hr_and_user);


module.exports = router;
