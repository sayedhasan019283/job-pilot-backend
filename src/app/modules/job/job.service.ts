import { TJob } from "./job.interface"
import { JobModel } from "./job.model"

const createAppliedIntoDB = async (payload : TJob) => {
    const result = await JobModel.create(payload);
    return result;
}

const readAllJobAppliedIntoDB = async () => {
    const result =  await JobModel.find({})
    return result
}
const readSingleJobAppliedIntoDB = async (appliedJobId : string) => {
    const result =  await JobModel.findOne({_id : appliedJobId})
    return result
}

const updateJobAppliedIntoDB = async (appliedJobId : string, payload : Partial<TJob>) => {
    const result = await JobModel.findByIdAndUpdate(appliedJobId, payload, {new : true});
    return result
}

const deleteAppliedJobFromDB = async (appliedJobId : string) => {
    const result = await JobModel.findByIdAndDelete(appliedJobId);
    return result
} 

export const jobService = {
    createAppliedIntoDB,
    readAllJobAppliedIntoDB,
    readSingleJobAppliedIntoDB,
    updateJobAppliedIntoDB,
    deleteAppliedJobFromDB
}