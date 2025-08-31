import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import convertHeicToPngMiddleware from '../../middlewares/convertHeicToPngMiddleware';

const UPLOADS_FOLDER = 'uploads/users';
const upload = fileUploadHandler(UPLOADS_FOLDER);
const UPLOADS_DRIVING_LICENSE_FOLDER = 'uploads/users/driving_licenses';
const uploadDrivingLicense = fileUploadHandler(UPLOADS_DRIVING_LICENSE_FOLDER);

const router = express.Router();

//create user
router
  .route('/create-user')
  .post(
    auth('admin'),
    upload.single('profileImage'),
    convertHeicToPngMiddleware(UPLOADS_FOLDER),
    UserController.createUser
  );
router.post(
  '/profile-image',
  auth('common'),
  upload.single('profileImage'),
  convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.updateUserImage
);
// router.post(
//   '/fill-up-user-data',
//   auth('common'),
//   uploadDrivingLicense.fields([
//     { name: 'drivingLicenseFront', maxCount: 1 },
//     { name: 'drivingLicenseBack', maxCount: 1 },
//   ]),
//   convertHeicToPngMiddleware(UPLOADS_DRIVING_LICENSE_FOLDER),
//   UserController.fillUpUserDetails
// );
// sub routes must be added after the main routes
router.get('/profile', auth('common'), UserController.getMyProfile);

router.patch(
  '/profile',
  auth('common'),
  validateRequest(UserValidation.updateUserValidationSchema),
  upload.single('profileImage'),
  convertHeicToPngMiddleware(UPLOADS_FOLDER),
  UserController.updateMyProfile
);

router.get(
  '/get-one-users/:id',
  auth('admin'),
  UserController.getSingleUserFromDB
);

//main routes
router
  .route('/')
  .get(auth('common'), UserController.getAllUsers)
  .delete(auth('common'), UserController.deleteMyProfile);
router.get(
  '/single-user/:id',
  auth("common"),
  UserController.getSingleUserById
)

export const UserRoutes = router;
