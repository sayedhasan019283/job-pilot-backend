import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required.',
        invalid_type_error: 'First name must be string',
      })
      .min(1, 'First name cannot be empty.'),
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email('Invalid email address.'),
    phoneNumber: z.string({
      required_error: 'Phone number is required.',
      invalid_type_error: 'Phone number must be string',
    }),
    isHumanTrue: z.boolean().optional(),
    Designation : z.string({required_error: 'Designation is required.'}),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(8, 'Password must be at least 8 characters long.'),
      ConfirmPassword: z
      .string({
        required_error: 'Password is required.',
      })
      .min(8, 'Password must be at least 8 characters long.'),
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required.',
        invalid_type_error: 'First name must be string',
      })
      .min(1, 'First name cannot be empty.')
      .optional(),
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email('Invalid email address.')
      .optional(),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required.',
        invalid_type_error: 'Phone number must be string',
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required.',
        invalid_type_error: 'Address must be string',
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
