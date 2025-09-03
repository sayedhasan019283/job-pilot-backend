import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { TJob } from "./job.interface"
import { JobModel } from "./job.model"

const createAppliedIntoDB = async (payload : TJob) => {
    const result = await JobModel.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Job assign create failed")
    }
    return result;
}

const readAllJobAppliedIntoDB = async () => {
    const result =  await JobModel.find({})
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found!")
    }
    return result
}
const readSingleJobAppliedIntoDB = async (appliedJobId : string) => {
    const result =  await JobModel.findOne({_id : appliedJobId})
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found")
    }
    return result
}

const updateJobAppliedIntoDB = async (appliedJobId : string, payload : Partial<TJob>) => {
    const result = await JobModel.findByIdAndUpdate(appliedJobId, payload, {new : true});
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Update failed!")
    }
    return result
}

const deleteAppliedJobFromDB = async (appliedJobId : string) => {
    const result = await JobModel.findByIdAndDelete(appliedJobId);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Delete Failed")
    }
    return result
} 

const filterByStatusFromDB = async (status: string) => {
    const result = await JobModel.find({ status: status });
    if (result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Didn't find any data!");
    }
    return result;
};

export const jobService = {
    createAppliedIntoDB,
    readAllJobAppliedIntoDB,
    readSingleJobAppliedIntoDB,
    updateJobAppliedIntoDB,
    deleteAppliedJobFromDB,
    filterByStatusFromDB
}