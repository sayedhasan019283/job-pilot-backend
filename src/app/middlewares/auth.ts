import { USER_ROLE } from './../modules/user/user.constant';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import AppError from '../../errors/AppError';
import config from '../../config';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rawToken = req.headers.authorization;
    const token = rawToken?.split(' ')[1];

    // Check if the token is missing
    if (!token) {
      console.log("hear========>>>>>>", token)
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Verify if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret as string,
    ) as JwtPayload;

    const { role, id } = decoded;
    console.log("User Id", id);
    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Check if the role is not allowed
    if (requiredRoles && !requiredRoles.includes(role)) {
      res.status(401).send({
        "success": false,
        "statusCode": 401,
        "message": "You have no access to this route",
      });
      return; // Ensure we stop further execution after sending the response
    }

    // Attach user to the request object
    req.user = decoded as JwtPayload;
    next();  // Proceed to the next middleware
  });
};

export default auth;
