import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';

// Define types for file uploads
interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

interface ProfileFiles {
  profileImage?: Express.Multer.File[];
  CV?: Express.Multer.File[];
  drivingLicenseFront?: Express.Multer.File[];
  drivingLicenseBack?: Express.Multer.File[];
}

// Define minimal user interface for authentication
interface AuthUser {
  id: string;
  userId?: string;
  _id?: string;
  userid?: string;
}

// Helper function to get user ID safely using type assertion
const getUserId = (req: Request): string => {
  // Use type assertion to access the user property
  const user = (req as any).user as AuthUser;
  if (!user || !user.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }
  return user.id;
};

// Helper function to get user ID with all possible properties
const getUserIdWithFallback = (req: Request): string => {
  const user = (req as any).user as AuthUser;
  const userId = user?.userId || user?.id || user?._id || user?.userid;
  
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }
  return userId;
};

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  console.log('=== DELETE USER BY ID REQUEST ===');
  
  const userIdToDelete = req.params.id;
  console.log('User ID to delete:', userIdToDelete);
  
  if (!userIdToDelete) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required');
  }

  // Validate user ID format (if using MongoDB)
  if (!mongoose.Types.ObjectId.isValid(userIdToDelete)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID format');
  }

  const adminUserId = getUserIdWithFallback(req);
  console.log('Admin performing deletion:', adminUserId);

  const result = await UserService.deleteUserById(userIdToDelete);
  console.log('Service result:', result);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

const deleteUserWithPassword = catchAsync(async (req: Request, res: Response) => {
  console.log('=== DELETE ACCOUNT REQUEST ===');
  
  const userId = getUserIdWithFallback(req);
  console.log('Final extracted userId:', userId);
  
  const { password } = req.body;
  console.log('Password from body:', password);

  if (!password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required to delete account');
  }

  const result = await UserService.deleteUserWithPassword(userId, password);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Account deleted successfully',
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  console.log("userData controller ===========>>>>>>>>>", userData);

  const files = req.files as ProfileFiles;

  // Handle file uploads and assign paths to userData
  if (files?.profileImage && files.profileImage[0]?.filename) {
    userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
  }
  if (files?.CV && files.CV[0]?.filename) {
    userData.CV = `/uploads/users/${files.CV[0].filename}`;
  }

  // Check if the user already exists by email
  const isUserExist = await User.findOne({ email: userData?.email });
  if (isUserExist) {
    if (!isUserExist.isEmailVerified) {
      const result = await UserService.isUpdateUser(isUserExist.email);
      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'User Exist! Need To Verify Email! OTP sent to your email, please verify your email within the next 3 minutes.',
        data: result,
      });
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
    }
  }

  // Generate UserId (Auto-increment 4-digit number)
  const lastUser = await User.findOne().sort({ userId: -1 });
  let newUserId = '0001'; 

  if (lastUser && lastUser.userId) {
    const lastUserId = parseInt(lastUser.userId, 10);
    newUserId = (lastUserId + 1).toString().padStart(4, '0');
  }

  userData.userId = newUserId;

  // Create the user in the database
  const result = await UserService.createUserToDB(userData);

  if (result.isEmailVerified) {
    return sendResponse(res, {
      code: StatusCodes.OK,
      message: "User's account created successfully.",
      data: result,
    });
  }

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  console.log("userData controller ===========>>>>>>>>>", userData);

  const files = req.files as ProfileFiles;

  userData.address = "N/A";
  userData.Designation = "N/A";
  userData.ConfirmPassword = userData.password;
  userData.role = "admin";

  // Handle file uploads and assign paths to userData
  if (files?.profileImage && files.profileImage[0]?.filename) {
    userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
  }
  if (files?.CV && files.CV[0]?.filename) {
    userData.CV = `/uploads/users/${files.CV[0].filename}`;
  }

  // Check if the user already exists by email
  const isUserExist = await User.findOne({ email: userData?.email });
  if (isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  // Generate UserId (Auto-increment 5-digit number)
  const lastUser = await User.findOne().sort({ userId: -1 });
  let newUserId = '00001'; // Default starting value

  if (lastUser && lastUser.userId) {
    const lastUserId = parseInt(lastUser.userId, 10);
    newUserId = (lastUserId + 1).toString().padStart(5, '0');
  }

  userData.userId = newUserId;

  // Create the user in the database
  const result = await UserService.createAdminAnalystUserToDB(userData);

  if (result.isEmailVerified) {
    return sendResponse(res, {
      code: StatusCodes.OK,
      message: "User's account created successfully.",
      data: result,
    });
  }

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
    data: result,
  });
});

const createManualUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  console.log("userData controller ===========>>>>>>>>>", userData);

  const files = req.files as ProfileFiles;

  userData.address = "N/A";
  userData.ConfirmPassword = userData.password;
  userData.role = "user";

  // Handle file uploads and assign paths to userData
  if (files?.profileImage && files.profileImage[0]?.filename) {
    userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
  }
  if (files?.CV && files.CV[0]?.filename) {
    userData.CV = `/uploads/users/${files.CV[0].filename}`;
  }

  // Check if the user already exists by email
  const isUserExist = await User.findOne({ email: userData?.email });
  if (isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  // Generate UserId (Auto-increment 4-digit number)
  const lastUser = await User.findOne().sort({ userId: -1 });
  let newUserId = '0001'; 

  if (lastUser && lastUser.userId) {
    const lastUserId = parseInt(lastUser.userId, 10);
    newUserId = (lastUserId + 1).toString().padStart(4, '0');
  }

  userData.userId = newUserId;

  // Create the user in the database
  const result = await UserService.createAdminAnalystUserToDB(userData);

  if (result.isEmailVerified) {
    return sendResponse(res, {
      code: StatusCodes.OK,
      message: "User's account created successfully.",
      data: result,
    });
  }

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
    data: result,
  });
});

const createAnalyst = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  console.log("userData controller ===========>>>>>>>>>", userData);

  const files = req.files as ProfileFiles;

  userData.address = "N/A";
  userData.Designation = "N/A";
  userData.ConfirmPassword = userData.password;
  userData.role = "analyst";

  // Handle file uploads and assign paths to userData
  if (files?.profileImage && files.profileImage[0]?.filename) {
    userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
  }
  if (files?.CV && files.CV[0]?.filename) {
    userData.CV = `/uploads/users/${files.CV[0].filename}`;
  }

  // Check if the user already exists by email
  const isUserExist = await User.findOne({ email: userData?.email });
  if (isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  // Generate UserId (Auto-increment 4-digit number)
  const lastUser = await User.findOne().sort({ userId: -1 });
  let newUserId = '0001'; 

  if (lastUser && lastUser.userId) {
    const lastUserId = parseInt(lastUser.userId, 10);
    newUserId = (lastUserId + 1).toString().padStart(4, '0');
  }

  userData.userId = newUserId;

  // Create the user in the database
  const result = await UserService.createAdminAnalystUserToDB(userData);

  if (result.isEmailVerified) {
    return sendResponse(res, {
      code: StatusCodes.OK,
      message: "User's account created successfully.",
      data: result,
    });
  }

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, role } = req.query;
  console.log("===========>>", typeof(page), typeof(limit), role);
  
  // Default to page 1 and limit 10 if not provided or invalid
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const userRole = role as string;
  
  let users;
  if (role) {
    users = await UserService.getAllUsersByRoleFromDB(pageNumber, limitNumber, userRole);
  } else {
    users = await UserService.getAllUsersFromDB(pageNumber, limitNumber);
  }
  
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Users retrieved successfully.',
    data: users,
  });
});

const getSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUserFromDB(id);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User retrieved successfully.',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  const result = await UserService.getMyProfile(userId);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Profile data retrieved successfully.',
    data: result,
  });
});

const fillUpUserDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const files = req.files as ProfileFiles;
  if (files?.drivingLicenseFront && files.drivingLicenseFront[0]?.filename) {
    req.body.drivingLicenseFront = `/uploads/users/driving_licenses/${files.drivingLicenseFront[0].filename}`;
  }
  if (files?.drivingLicenseBack && files.drivingLicenseBack[0]?.filename) {
    req.body.drivingLicenseBack = `/uploads/users/driving_licenses/${files.drivingLicenseBack[0].filename}`;
  }

  // Call your service with the userId and userData
  const result = await UserService.fillUpUserDetails(userId, req.body);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User details updated successfully.',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  const payload = req.body;
  const files = req.files as ProfileFiles;
  
  if (files?.profileImage && files.profileImage[0]?.filename) {
    payload.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
  }
  if (files?.CV && files.CV[0]?.filename) {
    payload.CV = `/uploads/users/${files.CV[0].filename}`;
  }
  
  const result = await UserService.updateMyProfile(userId, payload);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User updated successfully.',
    data: result,
  });
});

const updateUserImage = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  if (req.file) {
    req.body.image = '/uploads/users/' + req.file.filename;
  }
  const result = await UserService.updateMyProfile(userId, req.body);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User Image updated successfully.',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { action } = req.body;
  await UserService.changeUserStatus(userId, action);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: `User ${action}ed successfully.`,
    data: {},
  });
});

const deleteMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  
  await UserService.deleteMyProfile(userId);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User deleted successfully.',
    data: {},
  });
});

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  console.log('=== UPDATE USER BY ID REQUEST ===');
  
  const userId = req.params.id;
  console.log('User ID to update:', userId);
  
  if (!userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required');
  }

  // Validate user ID format (if using MongoDB)
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID format');
  }

  const payload = req.body;
  const files = req.files as ProfileFiles;
  
  console.log('Update payload:', payload);
  console.log('Files received:', files);

  // Handle file uploads and assign paths to payload
  if (files?.profileImage && files.profileImage[0]?.filename) {
    payload.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    console.log('Profile image updated:', payload.profileImage);
  }
  if (files?.CV && files.CV[0]?.filename) {
    payload.CV = `/uploads/users/${files.CV[0].filename}`;
    console.log('CV updated:', payload.CV);
  }

  // Check if user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Prevent updating certain sensitive fields
  const restrictedFields = ['password', 'ConfirmPassword', 'role', 'authType', 'socialId', 'isDeleted', 'isBlocked'];
  restrictedFields.forEach(field => {
    if (payload[field]) {
      console.warn(`⚠️ Attempt to update restricted field: ${field}`);
      delete payload[field];
    }
  });

  const result = await UserService.updateUserById(userId, payload);
  console.log('User updated successfully:', result.email);

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const getSingleUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);
  if (!result) {
    return sendResponse(res, {
      code: StatusCodes.NOT_FOUND,
      message: 'User not found.',
    });
  }
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User retrieved successfully.',
    data: result,
  });
});

const searchByUid = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { Uid } = req.params;
  const result = await UserService.searchByUidFromDB(Uid);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No User Found With This Id");
  }
  sendResponse(res, {
    code: StatusCodes.OK,
    message: "User Found Successfully!",
    data: result
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUserImage,
  getSingleUserFromDB,
  getMyProfile,
  updateMyProfile,
  fillUpUserDetails,
  deleteMyProfile,
  changeUserStatus,
  getSingleUserById,
  deleteUserWithPassword, 
  createAdmin,
  createManualUser, 
  updateUserById,
  createAnalyst, 
  deleteUserById,
  searchByUid
};