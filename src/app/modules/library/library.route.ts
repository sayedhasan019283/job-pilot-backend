import express from "express"
import { libraryController } from "./library.controller";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import validateRequest from "../../middlewares/validateRequest";
import { libraryValidation } from "./library.validation";

const router = express.Router()

// Define the upload folder
const UPLOADS_FOLDER_USER_DOCUMENTS = 'uploads/library';
const upload = fileUploadHandler(UPLOADS_FOLDER_USER_DOCUMENTS)


router.post(
    '/create',
    // validateRequest(libraryValidation.fileUploadSchema),
     upload.fields([
    {
      name: "fileUrl",
      maxCount: 1
    },
    {
      name: "thumbnailUrl",
      maxCount:1
    }
  ]),
    libraryController.createLibraryItem
)
router.get(
    '/get-all',
    libraryController.readAllCreateLibraryItem
)
router.delete(
    '/delete/:id',
    libraryController.deleteLibraryItem
)

export const LibraryRoute = router;