const express = require('express');
const router = express.Router();

// create_skill, delete_skill, add_location, delete_location, add_position, delete_position, add_department, delete_department, add_industry, delete_industry, get_all_skills, get_all_locations, get_all_positions, get_all_departments, get_all_industries, add_hero_logo

const { create_skill, delete_skill, add_location, delete_location, add_position, delete_position, add_department, delete_department, add_industry, delete_industry, get_all_skills, get_all_locations, get_all_positions, get_all_departments, get_all_industries, add_hero_logo, get_hero_logo, delete_hero_logo, get_job_by_industry } = require('./config_module');

router.post('/create-skill', create_skill);
router.delete('/delete-skill', delete_skill);
router.post('/add-location', add_location);
router.delete('/delete-location', delete_location);
router.post('/add-position', add_position);
router.delete('/delete-position', delete_position);
router.post('/add-department', add_department);
router.delete('/delete-department', delete_department);
router.post('/add-industry', add_industry);
router.delete('/delete-industry', delete_industry);
router.post('/hero-logo', add_hero_logo);
router.delete('/delete-hero-logo', delete_hero_logo);
router.get('/skills', get_all_skills);
router.get('/locations', get_all_locations);
router.get('/positions', get_all_positions);
router.get('/departments', get_all_departments);
router.get('/industries', get_all_industries);
router.get('/hero-logo', get_hero_logo);
router.get('/get-job-by-industry', get_job_by_industry);

module.exports = router;
