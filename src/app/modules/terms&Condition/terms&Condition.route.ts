import express from 'express'
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { termsConditionController } from './terms&Condition.controller';

const router = express.Router()

router.patch(
    '/update/:termsConditionId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    termsConditionController.updateTermsCondition
)
router.get(
    '/read',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.analyst, USER_ROLE.user),
    termsConditionController.readTermsCondition
)

export const privacyPolicyRouter = router;