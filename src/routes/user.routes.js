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
router.route("/getCarList").get(userController.getCarList);
router.route("/getModelList").get(userController.getModelList);
router.route("/getStateList").get(userController.getStateList);





router.use(authentication)



export default router;
