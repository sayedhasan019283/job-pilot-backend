// src/types/express.d.ts
import { USER_ROLE } from '../modules/user/user.constant';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        id: string;
        role: keyof typeof USER_ROLE;
        email?: string;
        name?: string;
        // Add other properties you need from your User model
      };
    }
  }
}

export {};