import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is Required',
      invalid_type_error: 'Email must be string',
    }),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be string',
    }),
  }),
});

export const mobileSocialLoginValidation = z.object({
  body: z.object({
    accessToken: z.string({
      required_error: 'Access token is required',
    }),
    provider: z.enum(['google', 'facebook'], {
      required_error: 'Provider is required',
      invalid_type_error: 'Provider must be either "google" or "facebook"',
    }),
  }),
});

const verifyEmailValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    oneTimeCode: z.string({
      required_error: 'One time code is required',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
    ConfirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current Password is required',
    }),
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
  }),
});

// Forgot password validation (if you need it)
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
});

// Resend OTP validation (if you need it)
const resendOTPValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  mobileSocialLoginValidation,
  verifyEmailValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema, // Add if needed
  resendOTPValidationSchema, // Add if needed
};