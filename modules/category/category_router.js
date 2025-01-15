const express = require('express');
const { get_category, create_category, delete_category, update_category, get_mega_category, get_category_with_mega_category_with_jobs_count, top_five_category_with_mega_category_with_jobs_count } = require('./module');
const router = express.Router();

router.get('/', get_category)
router.get('/mega-category', get_mega_category)
router.get('/top-five', top_five_category_with_mega_category_with_jobs_count)
router.get('/all', get_category_with_mega_category_with_jobs_count)
router.post('/create', create_category)
router.delete('/delete', delete_category)
router.patch('/update', update_category)

module.exports = router;
