const express = require('express');
const router = express.Router();
const initial_route = require('../modules/hooks/initial_route');
const v2_image_router = require('../modules/image_v2/v2_image_router');

const modulesRoutesV2 = [
      {
            path: '/',
            route: initial_route,
      },
      {
            path: '/image',
            route: v2_image_router,
      }
]

modulesRoutesV2.forEach(route => router.use(route.path, route.route));

module.exports = router;
