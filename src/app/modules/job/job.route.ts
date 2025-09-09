import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { jobValidationSchema } from './job.validation';
import { jobController } from './job.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.user),
    validateRequest(jobValidationSchema),
    jobController.createAppliedJob
)
router.get(
    '/get-all', // status as query
    auth('admin'),
    jobController.readAllJobApplied
)  
router.get(
    '/get-single/:appliedJobId',
    auth('admin'),
    jobController.readSingleJobApplied
) 
router.patch(
    '/update/:appliedJobId',
    auth('admin'),
    jobController.updateJobApplied
)
router.delete(
    '/delete/:appliedJobId',
    auth('admin'),
    jobController.deleteAppliedJob
) 

// router.get(
//     '/filter-by-status', // status
//     auth('admin'),
//     jobController.filterByStatus // This calls the filterByStatus controller
// );

export const JobRouter = router