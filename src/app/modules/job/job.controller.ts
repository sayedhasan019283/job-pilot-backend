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

const readAllJobApplied = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { status, page, limit } = req.query;

    // Parse 'page' and 'limit' query parameters as numbers
    // Default to page 1 and limit 10 if not provided or invalid
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    let result;

    // Check if status is provided
    if (!status) {
        result = await jobService.readAllJobAppliedIntoDB(pageNumber, limitNumber);
    } else {
        // Pass the status from the query dynamically to filterByStatusFromDB
        result = await jobService.filterByStatusFromDB(status as string, pageNumber, limitNumber);
    }

    sendResponse(res, {
        code: StatusCodes.OK,
        message: "Get All job Applied Data!",
        data: result
    });
});


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


// const filterByStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { status } = req.query;

//     // Check if status is provided
//     if (!status) {
//         return next(new ApiError(StatusCodes.BAD_REQUEST, "Status query parameter is required"));
//     }

//     const result = await jobService.filterByStatusFromDB(status as string); // Type assertion for status
//     res.status(StatusCodes.OK).json({ success: true, data: result });
// });

const  dashboardData = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const {period} = req.params;
  if (['day', 'week', 'month'].includes(period)) {
    const result = await jobService.dashboardDataFromDB(period as 'day' | 'week' | 'month');
    sendResponse(res , {
        code : StatusCodes.OK,
        message : "your dashboard data get successfully",
        data : result
    })
  } else {
    sendResponse(res , {
        code : StatusCodes.BAD_REQUEST,
        message : 'Invalid period, must be one of "day", "week", or "month".',
    })
  }
})

export const jobController = {
    createAppliedJob,
    readAllJobApplied,
    readSingleJobApplied,
    updateJobApplied,
    deleteAppliedJob,
    dashboardData
}