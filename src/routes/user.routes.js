import { Router } from "express";
import { uploadMiddleware } from "../middlewares/multer.js";
import authentication from "../middlewares/authentication.js";
// import userController from "../controllers/userController.js";
import userController from "../controllers/user.controller.js";
import { validations } from "../validations/validations.js";
import authorization from "../middlewares/authorization.js";

const router = Router();
router.route("/dropTables").post(userController.dropTables);

router.route("/dropTables").post(userController.dropTables);
router.route("/uploadImage").post(uploadMiddleware, userController.uploadImages);
router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/loginAsAGuest").post(userController.loginAsAGuest);
router.route("/forgetpassword").post( userController.forgetpassword);
router.route("/resetPassword").post( userController.resetPassword);
router.route("/resendOtp").post( userController.resendOTP);
router.route("/verifyOtp").post(validations.validateVerifyOtp, userController.verifyOTP);

router.use(authentication)
router.route("/deleteAccount").delete(authorization, userController.deleteAccount);
router.route("/logout").patch(userController.logout);
router.route("/getCarList").get(userController.getCarList);
router.route("/getModelList").get(userController.getModelList);
router.route("/getStateList").get(userController.getStateList);
router.route("/addVehicle").post(authorization, userController.addVehicle);
router.route("/dummyPayment").post(authorization, userController.dummyPayment);
router.route("/getvehicleDetails/:vehicleId").get(userController.getvehicleDetails);
router.route("/getVehicles").get(userController.getVehicles);
router.route("/homeScreen").get(userController.homeScreen);
router.route("/carBikeList").get(userController.carBikeList);
router.route("/popularModelList").get(userController.popularModelList);
router.route("/createPaymentIntent").post(authorization, userController.createPaymentIntent);
router.route("/verifyPayment").post(authorization, userController.verifyPayment);






//--Setting
router.route("/getProfile").get(authorization, userController.getProfile);
router.route("/updateProfile").put(authorization, userController.updateProfile);

//--Short listed Vehicles
router.route("/likeDislikeVehicle").post(authorization, userController.likeDislikeVehicle)
router.route("/shortlistedVehicle").get(authorization, userController.shortlistedVehicle)
router.route("/buyVehicleList").get(authorization, userController.buyVehicleList)
router.route("/getNotification").get(authorization, userController.getNotification)
router.route("/updateNotification").put(authorization, userController.updateNotification)


//--Chat List
router.route("/getRoom").get(authorization, userController.getRoom);
router.route("/getMessage/:roomId").get(authorization, userController.getMessage);
router.route("/createChatRoom").post(authorization, userController.createChatRoom);
router.route("/blockUserList").get(authorization, userController.blockUserList);
router.route("/blockUnblockUser").post(authorization, userController.blockUnblockUser);
router.route("/clearChat").put(authorization, userController.clearChat);



//--Switch Account
router.route("/switchAccount").put(authorization, userController.switchAccount);

//--Review Section
router.route("/getReviews").get(authorization, userController.getReviews);
router.route("/addReviews").post(authorization, userController.addReviews);

//--Valuation Flow
router.route("/delVehicle/:vehicleId").delete(authorization, userController.delVehicle);
router.route("/myvehicles").get(authorization, userController.myvehicles);
router.route("/editVehicle").put(authorization, userController.editVehicle);


export default router;
