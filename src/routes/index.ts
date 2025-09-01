import express from 'express';
import { AuthRoutes } from '../app/modules/Auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import path from 'path';
import { JobRouter } from '../app/modules/job/job.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/job',
    route: JobRouter,
  }
];   

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
