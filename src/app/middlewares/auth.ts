import { USER_ROLE } from './../modules/user/user.constant';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import AppError from '../../errors/AppError';
import config from '../../config';
import { User } from '../modules/user/user.model';

interface AuthUser extends JwtPayload {
  id: string;
  role: keyof typeof USER_ROLE;
  iat?: number;
  exp?: number;
}

// Define the user type you want to attach
interface RequestUser {
  _id: string;
  id: string;
  role: keyof typeof USER_ROLE;
  email?: string;
  name?: string;
}

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rawToken = req.headers.authorization;
    const token = rawToken?.split(' ')[1];

    if (!token) {
      console.log("Token missing");
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded: AuthUser;
    try {
      decoded = jwt.verify(
        token,
        config.jwt.accessSecret as string,
      ) as AuthUser;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }

    const { role, id } = decoded;
    console.log("User Id", id);
    
    if (!id || !role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Convert to plain object to safely access properties
    const userObject = user.toObject();
    
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      res.status(401).send({
        "success": false,
        "statusCode": 401,
        "message": "You have no access to this route",
      });
      return;
    }

    // Use type assertion
    (req as any).user = {
      _id: user._id.toString(),
      id: user._id.toString(),
      role: (userObject as any).role || role,
      email: (userObject as any).email,
      name: (userObject as any).name,
    };
    
    next();
  });
};

export default auth;