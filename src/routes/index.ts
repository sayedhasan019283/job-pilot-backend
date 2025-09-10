import express from 'express';
import { AuthRoutes } from '../app/modules/Auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { JobRouter } from '../app/modules/job/job.route';
import { LibraryRoute } from '../app/modules/library/library.route';
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
  },
  {
    path: '/library',
    route: LibraryRoute,
  }
];   

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
