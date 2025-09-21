import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { TJob } from "./job.interface"
import { JobModel } from "./job.model"
import { User } from "../user/user.model";
import { startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, subMonths, endOfDay, endOfWeek, endOfMonth } from 'date-fns';

const createAppliedIntoDB = async (payload : TJob) => {
    const result = await JobModel.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Job assign create failed")
    }
    return result;
}

const readAllJobAppliedIntoDB = async (page: number, limit: number) => {
    const result = await JobModel.find({})
        .sort({ createdAt: -1 })  // Sort by descending order
        .skip((page - 1) * limit) // Skip (page - 1) * limit records
        .limit(limit); // Limit to the specified number of records

    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Found!");
    }

    return result;
};

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

const filterByStatusFromDB = async (status: string, page: number, limit: number) => {
    console.log("Filtering jobs with status:", status);

    const result = await JobModel.find({ status }) // Use dynamic status here
        .sort({ createdAt: -1 })  // Sort by descending order
        .skip((page - 1) * limit) // Skip (page - 1) * limit records
        .limit(limit); // Limit to the specified number of records

    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Didn't find any data!");
    }

    return result;
};



const getTimeRange = (period: 'day' | 'week' | 'month', date = new Date()) => {
  switch (period) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'week':
      return { start: startOfWeek(date), end: endOfWeek(date) };
    case 'month':
      return { start: startOfMonth(date), end: endOfMonth(date) };
    default:
      throw new Error('Invalid period');
  }
};

const getPreviousTimeRange = (period: 'day' | 'week' | 'month', date = new Date()) => {
  switch (period) {
    case 'day':
      return { start: startOfDay(subDays(date, 1)), end: endOfDay(subDays(date, 1)) };
    case 'week':
      return { start: startOfWeek(subWeeks(date, 1)), end: endOfWeek(subWeeks(date, 1)) };
    case 'month':
      return { start: startOfMonth(subMonths(date, 1)), end: endOfMonth(subMonths(date, 1)) };
    default:
      throw new Error('Invalid period');
  }
};

const dashboardDataFromDB = async (period: 'day' | 'week' | 'month') => {
  const currentRange = getTimeRange(period); // Get current period range
  const previousRange = getPreviousTimeRange(period); // Get previous period range

  // Get counts for the current period
  const [userCountCurrent, jobCountCurrent, appliedJobCountCurrent, interviewScheduledJobsCurrent] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
    JobModel.countDocuments({ createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
    JobModel.countDocuments({ status: "Applied", createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
    (await JobModel.find({ status: "Interview", createdAt: { $gte: currentRange.start, $lte: currentRange.end } })).length,
  ]);

  // Get counts for the previous period
  const [userCountPrevious, jobCountPrevious, appliedJobCountPrevious, interviewScheduledJobsPrevious] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
    JobModel.countDocuments({ createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
    JobModel.countDocuments({ status: "Applied", createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
    JobModel.find({ status: "Interview", createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
  ]);

  console.log("userCountPrevious==>> ", userCountPrevious, "jobCountPrevious==>> ", jobCountPrevious, "appliedJobCountPrevious==>> ", appliedJobCountPrevious, "interviewScheduledJobsPrevious===>> ", interviewScheduledJobsPrevious)

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  return {
    userCountCurrent,
    jobCountCurrent,
    appliedJobCountCurrent,
    interviewScheduledJobsCurrent,
    userCountPercentageChange: calculatePercentageChange(userCountCurrent, userCountPrevious),
    jobCountPercentageChange: calculatePercentageChange(jobCountCurrent, jobCountPrevious),
    appliedJobCountPercentageChange: calculatePercentageChange(appliedJobCountCurrent, appliedJobCountPrevious),
    interviewScheduledJobsPercentageChange: calculatePercentageChange(interviewScheduledJobsCurrent, interviewScheduledJobsPrevious.length),
  };
};


export const jobService = {
    createAppliedIntoDB,
    readAllJobAppliedIntoDB,
    readSingleJobAppliedIntoDB,
    updateJobAppliedIntoDB,
    deleteAppliedJobFromDB,
    filterByStatusFromDB,
    dashboardDataFromDB
}