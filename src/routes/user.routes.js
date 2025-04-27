import { Router } from "express";
import { uploadMiddleware } from "../middlewares/multer.js";
import authentication from "../middlewares/authentication.js";
// import userController from "../controllers/userController.js";
import userController from "../controllers/user.controller.js";
import { validations } from "../validations/validations.js";


const router = Router();

router.route("/dropTables").post(userController.dropTables);
router.route("/uploadImage").post(uploadMiddleware, userController.uploadImages);
router.route("/register").post(validations.validateRegister, userController.register);
router.route("/login").post(validations.validateLogin, userController.login);
router.route("/forgetpassword").post(validations.validateForgotpassword, userController.forgetpassword);
router.route("/resetPassword").post(validations.validateResetPassword, userController.resetPassword);
router.route("/resendOtp").post(validations.validateResendOtp, userController.resendOTP);
router.route("/verifyOtp").post(validations.validateVerifyOtp, userController.verifyOTP);

router.use(authentication)
router.route("/getCarList").get(userController.getCarList);
router.route("/getModelList").get(userController.getModelList);
router.route("/getStateList").get(userController.getStateList);
router.route("/addVehicle").post(userController.addVehicle);
router.route("/dummyPayment").post(userController.dummyPayment);
router.route("/getvehicleDetails/:vehicleId").get(userController.getvehicleDetails);
router.route("/getVehicles").get(userController.getVehicles);
router.route("/homeScreen").get(userController.homeScreen);


//--Setting
router.route("/getProfile").get(userController.getProfile);
router.route("/updateProfile").put(userController.updateProfile);





export default router;
