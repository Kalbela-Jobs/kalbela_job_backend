const express = require('express');
const { create_resource, get_resource, get_search, get_single, update_resource, delete_resource, get_resource_category } = require('./module');
const router = express.Router();

router.post('/create', create_resource);
router.get("/", get_resource);
router.get("/search", get_search);
router.get("/single", get_single);
router.put("/update", update_resource);
router.delete("/delete", delete_resource);

router.get('/category', get_resource_category)


module.exports = router;
