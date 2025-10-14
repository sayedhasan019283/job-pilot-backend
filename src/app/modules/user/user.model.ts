import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { TUser, UserModal } from './user.interface';
import paginate from '../../../helpers/paginate';

const userSchema = new Schema<TUser, UserModal>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: function() {
        return this.authType === 'local'; // Only required for local auth
      }
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [false, 'Phone number is optional'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    CV: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    postCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
    },
    password: {
      type: String,
      required: function() {
        return this.authType === 'local'; // Only required for local auth
      },
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    ConfirmPassword: {
      type: String,
      required: function() {
        return this.authType === 'local'; // Only required for local auth
      },
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    Designation: {
      type: String,
      required: [true, "Designation Is Required"]
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "analyst", "user"],
      default: "user"
    },
    // Social login fields
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook', 'apple'],
      default: 'local'
    },
    socialId: {
      type: String,
      sparse: true
    },
    isHumanTrue: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: [true, 'Deleted status is required'],
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription', 
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: [true, 'Blocked status is required'],
    },
    isSubscription: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: [true, 'Email verification status is required'],
    },
    isResetPassword: {
      type: Boolean,
      default: false,
      required: [true, 'Reset password status is required'],
    },
    oneTimeCode: {
      type: String,
      default: null,
      required: [false, 'One-time code is optional'],
    },
    oneTimeCodeExpire: {
      type: Date,
      default: null,
      required: [false, 'One-time code expiry is optional'],
    },
    subEndDate: {
      type: Date,
      default: null,
    },
    serviceCount: {
      type: Number,
      default: 0
    },
    otpCountDown: {
      type: Number,
      default: null,
      required: [false, 'OTP count down is optional'],
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked', 'Delete'],
      default: 'Active',
    },
 
  // FCM Token fields
  fcmToken: {
    type: String,
    default: null,
  },
  fcmTokens: [{
    type: String, // For multiple devices
  }],
  notificationPreferences: {
    applied: { type: Boolean, default: true },
    shortlisted: { type: Boolean, default: true },
    interview: { type: Boolean, default: true },
    offer: { type: Boolean, default: true },
    info: { type: Boolean, default: true },
    system: { type: Boolean, default: true },
  }
,
    Applied: {
      type: Boolean,
      default: true
    },
    Shortlisted: {
      type: Boolean,
      default: true
    },
    Rejected: {
      type: Boolean,
      default: true
    },
    Interview: {
      type: Boolean,
      default: true
    },
    Offer: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName || ''}`;
});

userSchema.plugin(paginate);

// Static methods
userSchema.statics.isExistUserById = async function (id: string) {
  return await this.findById(id);
};

userSchema.statics.isExistUserByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isMatchPassword = async function (
  password: string,
  hashPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
};

// Middleware to hash password before saving (only for local auth)
userSchema.pre('save', async function (next) {
  if (this.authType === 'local' && this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt.saltRounds)
    );
  }
  next();
});

export const User = model<TUser, UserModal>('User', userSchema);