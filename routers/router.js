const express = require('express');
const router = express.Router();
const image_router = require('../modules/image/image_router');  // Adjust the path if necessary
const initial_route = require('../modules/hooks/initial_route'); // Adjust the path if necessary
const auth_router = require('../modules/auth/auth_router'); // Adjust the path if necessary
const package_router = require('../modules/package/package_router'); // Adjust the path if necessary
const job_router = require('../modules/jobs/job_route'); // Adjust the path if necessary
const workspace_router = require('../modules/organization/org_router'); // Adjust the path if necessary
const category_router = require('../modules/category/category_router'); // Adjust the path if necessary
const job_type_router = require('../modules/job_type/job_type_router'); // Adjust the path if necessary

// Define module routes
const modulesRoutes = [
      {
            path: '/',         // Default path
            route: initial_route,
      },
      {
            path: '/image',    // Image routes
            route: image_router,
      },
      {
            path: '/auth',      // Auth routes
            route: auth_router,
      },
      {
            path: '/package',
            route: package_router,
      },
      {
            path: '/jobs',
            route: job_router,
      },
      {
            path: '/workspace',
            route: workspace_router,
      },
      {
            path: '/category',
            route: category_router,
      },
      {
            path: '/job-type',
            route: job_type_router,
      }
];

// Attach each route to the main router
modulesRoutes.forEach(route => router.use(route.path, route.route));

module.exports = router;
