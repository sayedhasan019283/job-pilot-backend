import { NotificationModel } from "./notification.model"

const getNotificationUnderUser = async (UId : string) => {
    const result = await NotificationModel.find({userId : UId})
    return result
}

export const notificationService = {
    getNotificationUnderUser
}