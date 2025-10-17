// notification.controller.ts
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { notificationService } from './notification.service';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

// Define interface for authenticated user
interface AuthenticatedUser {
  id: string;
  userId?: string;
  _id?: string;
  userid?: string;
}

// ✅ FIXED: Use type intersection instead of interface extension
type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

// Helper function to get user ID safely
const getUserId = (req: Request): string => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (!authenticatedReq.user || !authenticatedReq.user.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }
  return authenticatedReq.user.id;
};

// Get notifications with filtering
const getNotificationUnderUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req);
  const filters = req.query;
  
  const result = await notificationService.getNotificationUnderUser(id, filters);
  
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No Notification Found!");
  }

  sendResponse(res, {
    code: StatusCodes.OK,
    message: "Notifications retrieved successfully",
    data: result
  });
});

// Mark as read
const markNotificationAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req);
  const { notificationId } = req.params;

  const result = await notificationService.markAsRead(notificationId, id);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found");
  }

  sendResponse(res, {
    code: StatusCodes.OK,
    message: "Notification marked as read",
    data: result
  });
});

// Mark all as read
const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req);
  const { type } = req.body;

  const result = await notificationService.markAllAsRead(id, type);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: type ? `All ${type} notifications marked as read` : "All notifications marked as read",
    data: result
  });
});

// Get unread count
const getUnreadNotificationCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req);
  const { type } = req.query;

  const count = await notificationService.getUnreadCount(id);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: "Unread count retrieved successfully",
    data: { unreadCount: count }
  });
});

// Send test notification
const sendTestNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = getUserId(req);
  const { title, text, type } = req.body;

  const notification = await notificationService.sendRealTimeNotification(
    id, 
    title || 'Test Notification', 
    text || 'This is a test notification from your app!', 
    type || 'info'
  );

  sendResponse(res, {
    code: StatusCodes.OK,
    message: "Test notification sent successfully",
    data: notification
  });
});

export const notificationController = {
  getNotificationUnderUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  sendTestNotification,
};