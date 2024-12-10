const express = require('express');
const router = require('../auth/auth_router');
const { get_all_packages, create_package } = require('./package_module');

router.post('/create', create_package);
router.get('/', get_all_packages);

module.exports = router;
