
import admin from '../../../config/firebase';
import { User } from '../user/user.model';
import { NotificationModel } from './notification.model';



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
