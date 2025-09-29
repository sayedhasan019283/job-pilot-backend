import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  console.log("userData controller ===========>>>>>>>>>" ,userData);

  const files = req.files as {
    profileImage?: { filename: string }[];
    CV?: { filename: string }[];
  };

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

  if (lastUser) {
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
  console.log("userData controller ===========>>>>>>>>>" ,userData);

  const files = req.files as {
    profileImage?: { filename: string }[];
    CV?: { filename: string }[];
  };

  userData.address = "N/A"
  userData.Designation = "N/A"
  userData.ConfirmPassword = userData.password
  userData.role = "admin"

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

if (lastUser) {
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
  console.log("userData controller ===========>>>>>>>>>" ,userData);

  const files = req.files as {
    profileImage?: { filename: string }[];
    CV?: { filename: string }[];
  };

  userData.address = "N/A"
  userData.ConfirmPassword = userData.password
  userData.role = "user"

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

  if (lastUser) {
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
  console.log("userData controller ===========>>>>>>>>>" ,userData);

  const files = req.files as {
    profileImage?: { filename: string }[];
    CV?: { filename: string }[];
  };

  userData.address = "N/A"
  userData.Designation = "N/A"
  userData.ConfirmPassword = userData.password
  userData.role = "analyst"

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

  if (lastUser) {
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
  const {page, limit, role} = req.query
  console.log("===========>>" ,typeof(page), typeof(limit), role)
  // Default to page 1 and limit 10 if not provided or invalid
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const userRole = role as string
    let users
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
  const result = await UserService.getMyProfile(req.user.id);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Profile data retrieved successfully.',
    data: result,
  });
});

const fillUpUserDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (
    files &&
    'drivingLicenseFront' in files &&
    'drivingLicenseBack' in files
  ) {
    req.body.drivingLicenseFront =
      '/uploads/users/driving_licenses' + files.drivingLicenseFront[0].filename;
    req.body.drivingLicenseBack =
      '/uploads/users/driving_licenses' + files.drivingLicenseBack[0].filename;
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
  const userId = req.user.id;
  const payload = req.body;
  const files = req.files as {
      profileImage?: { filename: string }[];
      CV?: { filename: string }[];
    };
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
  const userId = req.user.id;
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
  const userId = req.user.id;
  await UserService.deleteMyProfile(userId);
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User deleted successfully.',
    data: {},
  });
});


const getSingleUserById = catchAsync(async (req , res) => {
  const {id} = req.params;
  const result = await UserService.getSingleUserFromDB(id);
  if (!result) {
    return sendResponse(res, {
      code: StatusCodes.OK,
      message: 'User did not get .',
    });
  }
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User get successfully.',
    data: result,
  });
})

const searchByUid = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const {Uid} = req.params;
  const result = await UserService.searchByUidFromDB(Uid)
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No User Found With THis Id");
  }
  sendResponse(res, {
    code : StatusCodes.OK,
    message : "User Found Successfully!",
    data : result
  })
})

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
  createAdmin,
  createManualUser,
  createAnalyst,
  searchByUid
};
