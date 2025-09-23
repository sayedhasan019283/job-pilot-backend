import express from 'express'
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { privacyPolicyController } from './privacy&Policy.controller';

const router = express.Router()

router.patch(
    '/update/:privacyPolicyId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    privacyPolicyController.updatePrivacyPolicy
)
router.get(
    '/read',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.analyst, USER_ROLE.user),
    privacyPolicyController.readPrivacyPolicy
)

export const privacyPolicyRouter = router;