import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { jobService } from "./job.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createAppliedJob = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const payload = req.body;
    const adminId = req.user.id;
    const result = await jobService.createAppliedIntoDB({...payload, adminId});
    sendResponse(res, {
        code : StatusCodes.OK,
        message : "job assign successful",
        data : result
    })
})

const readAllJobApplied = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const result = await jobService.readAllJobAppliedIntoDB();
    sendResponse(res , {
        code : StatusCodes.OK,
        message : "Get All job Applied Data!",
        data : result
    })
})

const readSingleJobApplied = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const {appliedJobId} = req.params
    const result = await jobService.readSingleJobAppliedIntoDB(appliedJobId)
    sendResponse(res , {
        code : StatusCodes.OK,
        message : "Get single data!",
        data : result
    })
})

const updateJobApplied = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const payload = req.body;
    const {appliedJobId} = req.params
    const result = await jobService.updateJobAppliedIntoDB(appliedJobId , payload);
    sendResponse(res , {
        code : StatusCodes.OK,
        message : "Update Successful.",
        data : result
    })
})

const deleteAppliedJob = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const {appliedJobId} = req.params;
    const result = await jobService.deleteAppliedJobFromDB(appliedJobId);
    sendResponse(res , {
        code : StatusCodes.OK,
        message : "Delete Successful",
        data : result
    })
})

export const jobController = {
    createAppliedJob,
    readAllJobApplied,
    readSingleJobApplied,
    updateJobApplied,
    deleteAppliedJob
}