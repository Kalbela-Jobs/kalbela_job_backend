const express = require('express');
const { get_category, create_category, delete_category, update_category, get_mega_category, get_category_with_mega_category_with_jobs_count, top_five_category_with_mega_category_with_jobs_count } = require('./module');
const { create_govt_category, get_govt_category, update_govt_category, delete_govt_category } = require('./govt_category_module');
const router = express.Router();

router.get('/', get_category)
router.get('/mega-category', get_mega_category)
router.get('/top-five', top_five_category_with_mega_category_with_jobs_count)
router.get('/all', get_category_with_mega_category_with_jobs_count)
router.post('/create', create_category)
router.delete('/delete', delete_category)
router.patch('/update', update_category)

router.post('/create-govt-category', create_govt_category)
router.get('/get-all-govt-category', get_govt_category)
router.put('/update-govt-category', update_govt_category)
router.delete('/delete-govt-category', delete_govt_category)

module.exports = router;
