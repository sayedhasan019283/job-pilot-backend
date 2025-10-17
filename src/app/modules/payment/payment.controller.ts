import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentService } from "./payment.service";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

// Define interface for authenticated user
interface AuthenticatedUser {
  id: string;
  userId?: string;
  _id?: string;
  userid?: string;
}

// ✅ FIXED: Use type intersection instead of interface extension
type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

// Helper function to get user ID safely
const getUserId = (req: Request): string => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (!authenticatedReq.user || !authenticatedReq.user.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }
  return authenticatedReq.user.id;
};

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = getUserId(req);
    const result = await paymentService.createPaymentToDB(payload, id);
    
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something Went Wrong!" )
    }   
    
    sendResponse(res,{
        code: StatusCodes.OK,
        message: "Payment Done Successfully.",
        data: result
    });
});

const getAllPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getAllPaymentFromDB();
    
    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found!")
    }
    
    sendResponse(res, {
        code: StatusCodes.OK,
        message: "Get All Payment Data Successfully.",
        data: result
    });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    const result = await paymentService.getSinglePaymentFromDB(paymentId);
    
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found!")
    }
    
    sendResponse(res, {
        code: StatusCodes.OK,
        message: "Get Single Payment Data Successfully.",
        data: result
    });
});

const getAllPaymentUnderUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = getUserId(req);
    const result = await paymentService.getAllPaymentUnderUserFromDB(id);
    
    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found!")
    }  
    
    sendResponse(res,{
        code: StatusCodes.OK,
        message: "Get All payment Data Under User",
        data: result
    });
});

export const paymentController = {
    createPayment,
    getAllPayment,
    getSinglePayment,
    getAllPaymentUnderUser
};