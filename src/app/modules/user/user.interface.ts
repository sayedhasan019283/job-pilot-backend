import { Model, Types } from 'mongoose';
import { Role } from '../../middlewares/roles';
import { TUserStatus } from './user.constant';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';

export type TUser = {
  _id: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  profileImage: string;
  fcmToken: string;
  phoneNumber: string;
  password: string;
  ConfirmPassword: string;
  status: TUserStatus;
  city : String;
  postCode : string;
  country : string;
  role: Role;
  isHumanTrue: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  isResetPassword: boolean;
  isSubscription: boolean;
  oneTimeCode?: string | null;
  oneTimeCodeExpire?: Date | null;
  subEndDate?: Date | null;
  otpCountDown?: number | null; 
  serviceCount? : number;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserModal extends Model<TUser> {
  paginate: (
    filter: object,
    options: PaginateOptions
  ) => Promise<PaginateResult<TUser>>;
  isExistUserById(id: string): Promise<Partial<TUser> | null>;
  isExistUserByEmail(email: string): Promise<Partial<TUser> | null>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}
