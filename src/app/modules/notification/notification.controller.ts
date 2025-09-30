
import { NextFunction, Request, Response } from 'express';
import admin from '../../../config/firebase';
import catchAsync from '../../../shared/catchAsync';
import { User } from '../user/user.model';
import { NotificationModel } from './notification.model';
import { notificationService } from './notification.service';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

// Send Push Notification function
export const sendPushNotification = async (userId: string, text: string, title : string) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Retrieve the fcmToken from the user document
    const fcmToken = user.fcmToken;
    if (!fcmToken) {
      throw new Error('FCM token not found for this user');
    }

    // Send notification via Firebase Cloud Messaging
    const message = {
      notification: {
        title: title,
        body: text,
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    // Save notification to the database
    const notification = new NotificationModel({
      text,
      userId: user._id,
    });
    await notification.save();

    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

const getNotificationUnderUser = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const {id} = req.user;
    const result = await notificationService.getNotificationUnderUser(id);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Notification Found!")
    }
    sendResponse(res, {
        code : StatusCodes.OK,
        message : "Get All Notification For this user.",
        data : result
    })
})

export const notificationController = {
    getNotificationUnderUser
}
