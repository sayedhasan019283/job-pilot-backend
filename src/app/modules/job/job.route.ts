import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { jobValidationSchema } from './job.validation';
import { jobController } from './job.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.admin),
    validateRequest(jobValidationSchema),
    jobController.createAppliedJob
)
router.get(
    '/get-all', // status as query
    auth(USER_ROLE.admin),
    jobController.readAllJobApplied
)  
router.get(
    '/get-single/:appliedJobId',
    auth(USER_ROLE.admin),
    auth('admin'),
    jobController.readSingleJobApplied
) 
router.patch(
    '/update/:appliedJobId',
    auth(USER_ROLE.admin),
    jobController.updateJobApplied
)
router.delete(
    '/delete/:appliedJobId',
    auth(USER_ROLE.admin),
    jobController.deleteAppliedJob
) 

// router.get(
//     '/filter-by-status', // status
//     auth('admin'),
//     jobController.filterByStatus // This calls the filterByStatus controller
// );

router.get(
    '/dashboard-data/:period',
    jobController.dashboardData
)

export const JobRouter = router