const express = require('express');
const { get_category, create_category, delete_category, update_category, get_mega_category } = require('./module');
const router = express.Router();

router.get('/', get_category)
router.get('/mega-category', get_mega_category)
router.get('/get', get_category)
router.post('/create', create_category)
router.delete('/delete', delete_category)
router.patch('/update', update_category)

module.exports = router;
