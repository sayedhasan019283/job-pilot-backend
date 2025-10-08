import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { privacyPolicyService } from "./privacy&Policy.service";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

const createPrivacyPolicy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await privacyPolicyService.createPrivacyPolicyInDB(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Privacy Policy Not Created Successfully!");
    }
    sendResponse(res, {
        code: StatusCodes.CREATED,
        message: "Privacy Policy Created Successfully!",
        data: result
    });
});

const updatePrivacyPolicy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const {privacyPolicyId} = req.params;
    const result = await privacyPolicyService.updatePrivacyPolicyFromDB(payload, privacyPolicyId);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Privacy Policy Not Update Successfully!");
    }
    sendResponse(res, {
        code: StatusCodes.OK,
        message: "Successfully Updated",
        data: result
    });
});

const readPrivacyPolicy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await privacyPolicyService.readPrivacyPolicyFromDB();
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found");
    }
    sendResponse(res, {
        code: StatusCodes.OK,
        message: 'Get privacy policy data successfully!',
        data: result
    });
});

export const privacyPolicyController = {
    createPrivacyPolicy,
    updatePrivacyPolicy,
    readPrivacyPolicy
};