import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
import { notificationController } from './notification.controller'


const router = express.Router()


router.get(
    '/read-notification',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.analyst),
    notificationController.getNotificationUnderUser
)


export const notificationRouter = router