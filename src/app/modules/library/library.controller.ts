import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { libraryService } from "./library.service";
import sendResponse from "../../../shared/sendResponse";

const createLibraryItem = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
    const payload = req.body;
    const files = req.files as {
      fileUrl?: { filename: string }[];
      thumbnailUrl?: { filename: string }[];
    }; 
    if (files?.fileUrl && files.fileUrl[0]?.filename) {
      payload.fileUrl = `/uploads/library/${files.fileUrl[0].filename}`;
    }
    if (files?.thumbnailUrl && files.thumbnailUrl[0]?.filename) {
      payload.thumbnailUrl = `/uploads/library/${files.thumbnailUrl[0].filename}`;
    }
    const result = await libraryService.createLibraryItem(payload);
    sendResponse(res, {
        code : 201,
        message : "Library Created successfully.",
        data : result
    })   
})

const readAllCreateLibraryItem = async (req : Request, res : Response, next : NextFunction) => {
    const result = await libraryService.readAllCreateLibraryItem();
    sendResponse(res, {
        code : 200,
        message : "Library Items Get successfully.",
        data : result
    })
}

export const libraryController = {
    createLibraryItem,
    readAllCreateLibraryItem
}