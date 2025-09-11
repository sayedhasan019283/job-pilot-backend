import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { TFileUpload } from "./library.interface";
import { LibraryModel } from "./library.model";

const createLibraryItem = async (payload : TFileUpload) => {
    const result = await LibraryModel.create(payload);
    if (!result ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Library is not Created successfully!")
    }
    return result 
}

const readAllCreateLibraryItem = async () => {
    const result = await LibraryModel.find({})
    if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No Data Exist in DB!")
    }
    return result
}

const deleteLibraryItem = async (id : string) => {
    const result = await LibraryModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "This item is not deleted!")
    }
    return result
} 

export const libraryService = {
    createLibraryItem,
    readAllCreateLibraryItem,
    deleteLibraryItem
}