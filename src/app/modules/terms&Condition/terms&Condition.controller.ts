import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { termsConditionService } from "./terms&Condition.service";

const updateTermsCondition = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const payload = req.body;
    const {termsConditionId} = req.params 
    const result = await termsConditionService.updateTermsConditionFromDB(payload, termsConditionId);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Terms And Condition Not Update Successfully!");
    }
    sendResponse(res, {
        code : StatusCodes.OK,
        message : "Successfully Updated",
        data : result
    })
})

const readTermsCondition = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const result = await termsConditionService.readTermsConditionFromDB();
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found");
    }
    sendResponse(res, {
        code : StatusCodes.OK,
        message : 'Get Terms And Condition data successfully!',
        data : result
    })
})

export const termsConditionController = {
    updateTermsCondition,
    readTermsCondition
}