import { Router } from "express";
// import { uploadMiddleware } from "../middlewares/multer.js";
// import authentication from "../middlewares/authentication.js";
// import userController from "../controllers/userController.js";
import userController from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(userController.register);



export default router;
