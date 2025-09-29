import mongoose, { Schema, Document, Types } from 'mongoose';
import { TNotification } from './notification.interface';

// Create the Notification schema
const notificationSchema = new Schema<TNotification>({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referring to the User model
    required: true,
  },
}, { timestamps: true });

// Create the Notification model
export const NotificationModel = mongoose.model<TNotification>('Notification', notificationSchema);