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
router.route("/deleteAccount").delete(userController.deleteAccount);
router.route("/logout").patch(userController.logout);
router.route("/getCarList").get(userController.getCarList);
router.route("/getModelList").get(userController.getModelList);
router.route("/getStateList").get(userController.getStateList);
router.route("/addVehicle").post(userController.addVehicle);
router.route("/dummyPayment").post(userController.dummyPayment);
router.route("/getvehicleDetails/:vehicleId").get(userController.getvehicleDetails);
router.route("/getVehicles").get(userController.getVehicles);
router.route("/homeScreen").get(userController.homeScreen);
router.route("/carBikeList").get(userController.carBikeList);
router.route("/popularModelList").get(userController.popularModelList);
router.route("/createPaymentIntent").post(userController.createPaymentIntent);
router.route("/verifyPayment").post(userController.verifyPayment);






//--Setting
router.route("/getProfile").get(userController.getProfile);
router.route("/updateProfile").put(userController.updateProfile);

//--Short listed Vehicles
router.route("/likeDislikeVehicle").post(userController.likeDislikeVehicle)
router.route("/shortlistedVehicle").get(userController.shortlistedVehicle)
router.route("/buyVehicleList").get(userController.buyVehicleList)
router.route("/getNotification").get(userController.getNotification)


//--Chat List
router.route("/getRoom").get(userController.getRoom);
router.route("/getMessage/:roomId").get(userController.getMessage);
router.route("/createChatRoom").post(userController.createChatRoom);
router.route("/blockUserList").get(userController.blockUserList);
router.route("/blockUnblockUser").post(userController.blockUnblockUser);
router.route("/clearChat").put(userController.clearChat);



//--Switch Account
router.route("/switchAccount").put(userController.switchAccount);

//--Review Section
router.route("/getReviews").get(userController.getReviews);
router.route("/addReviews").post(userController.addReviews);

//--Valuation Flow
router.route("/delVehicle/:vehicleId").delete(userController.delVehicle);
router.route("/myvehicles").get(userController.myvehicles);
router.route("/editVehicle").put(userController.editVehicle);


export default router;
