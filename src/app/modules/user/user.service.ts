import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from './user.model';
import { TUser } from './user.interface';
import { sendEmailInvitation, sendEmailVerification } from '../../../helpers/emailHelper';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import createOtp from '../Auth/createOtp';

//create new user
const createUserToDB = async (payload: Partial<TUser>) => {
  const { oneTimeCode, oneTimeCodeExpire } = createOtp();
  payload.otpCountDown = 180;
  payload.oneTimeCode = oneTimeCode;
  payload.oneTimeCodeExpire = oneTimeCodeExpire;

  console.log("payload==============>>>>>>>>>>>" ,payload)

  const newUser = await User.create(payload);
  if (!newUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }
  if (!newUser.isEmailVerified) {
    // Send email verification
    await sendEmailVerification(newUser.email as string, oneTimeCode);
  }

  return newUser;
};
const createAdminAnalystUserToDB = async (payload: Partial<TUser>) => {
  payload.otpCountDown = 180;

  console.log("payload==============>>>>>>>>>>>" ,payload)

  const newUser = await User.create(payload);
  if (!newUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }
  if (!newUser.isEmailVerified) {
    // Send email verification
    await sendEmailInvitation(newUser.email as string, payload.password as string, 
      newUser.role as string);
  }

  return newUser;
};


//get all user
const getAllUsersFromDB = async (pageNumber : number, limitNumber : number) => {
  const users = await User.find({ role: 'user' })
  .sort({ createdAt: -1 })
  .skip((pageNumber - 1) * limitNumber) // Skip (page - 1) * limit records
  .limit(limitNumber); // Limit to the specified number of records;
  return users;
};

const getAllUsersByRoleFromDB = async (pageNumber : number, limitNumber : number, role : string) => {
  const users = await User.find({ role: role })
  .sort({ createdAt: -1 })
  .skip((pageNumber - 1) * limitNumber) // Skip (page - 1) * limit records
  .limit(limitNumber); // Limit to the specified number of records;
  return users;
};

//get single user
const getSingleUserFromDB = async (id: string): Promise<Partial<TUser>> => {
  const user = await User.isExistUserById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return user;
};

//update my profile
const updateMyProfile = async (
  id: string,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return User.findByIdAndUpdate(id, payload, { new: true });
};

//fill up user details data
const fillUpUserDetails = async (userId: string, payload: Partial<TUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return User.findByIdAndUpdate(userId, payload, { new: true });
};

const updateUserImage = async (userId: string, payload: Partial<TUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return User.findByIdAndUpdate(userId, payload, { new: true });
};
//get my profile
const getMyProfile = async (userId: string): Promise<Partial<TUser>> => {
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const changeUserStatus = async (
  id: string,
  action: 'block' | 'unblock' | 'delete' | 'active'
): Promise<TUser | null> => {
  // Validate if the user exists
  const user = await User.isExistUserById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Prepare the update payload
  let updatePayload = {};
  switch (action) {
    case 'block':
      updatePayload = { isBlocked: true, status: 'Blocked' };
      break;
    case 'unblock':
      updatePayload = { isBlocked: false, status: 'Active' };
      break;
    case 'delete':
      updatePayload = { isDeleted: true, status: 'Delete' };
      break;
    case 'active':
      updatePayload = { isDeleted: false, isBlocked: false, status: 'Active' };
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid action!');
  }

  // Update and return the user
  return User.findByIdAndUpdate(id, updatePayload, { new: true });
};

//delete my profile
const deleteMyProfile = async (id: string): Promise<TUser | null> => {
  await getSingleUserFromDB(id);
  return User.findByIdAndUpdate(
    id,
    { status: 'Delete', isDeleted: true },
    { new: true }
  );
};

//Update user email verification and send OTP.
const isUpdateUser = async (email: string): Promise<TUser | null> => {
  const { oneTimeCode, oneTimeCodeExpire } = createOtp();

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      isEmailVerified: false,
      isResetPassword: false,
      oneTimeCode,
      oneTimeCodeExpire,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found for update!');
  }

  // Send email verification
  await sendEmailVerification(updatedUser.email, oneTimeCode);

  return updatedUser;
};

const getSingleUserById = async (id :string) => {
  const result = await User.findById(id);
  return result
}

const searchByUidFromDB = async (Uid : string) => {
  const result = await User.find({userId : Uid});
  return result;
}


export const UserService = {
  createUserToDB,
  getAllUsersFromDB,
  getAllUsersByRoleFromDB,
  getSingleUserFromDB,
  getMyProfile,
  updateMyProfile,
  updateUserImage,
  fillUpUserDetails,
  deleteMyProfile,
  isUpdateUser,
  changeUserStatus,
  createAdminAnalystUserToDB,
  searchByUidFromDB
};
