import groomingServices from "../constant/specializations.js";
import * as Model from "../models/index.js";
import { errorRes, successRes } from "../utils/response.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET_KEY = process.env.JWT_SECRET;



const userServices = {
  uploadImages: async (req, res) => {
    try {
      let image;
      if (req.files && req.files.image) {
        image = `public/${req.files.image[0].filename}`;
      }
      return successRes(res, 200, "Image", { data: image });
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },

  registerUser: async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;
      const isEmailExist = await Model.User.findOne({
        email: email.toLowerCase(),
      });
      console.log(isEmailExist, "email");
      if (isEmailExist) {
        if (!isEmailExist.email_verified) {
          const otp = Math.floor(1000 + Math.random() * 9000);
          isEmailExist.email_otp = otp;
          await isEmailExist.save();
        //   sendEmail({
        //     otp,
        //     email: isEmailExist.email,
        //     project_name: process.env.PROJECT_NAME,
        //     type: "register",
        //     user: isEmailExist,
        //   });
          return successRes(
            res,
            200,
            "OTP has been sent to your provided email",
            isEmailExist
          );
        } else {
          return errorRes(res, 400, "Email already exists");
        }
      }

      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);
      const email_otp = Math.floor(1000 + Math.random() * 9000);

      // Create new user
      const newUser = await Model.User.create({
        email: email.toLowerCase(),
        password: hashPassword,
        email_otp,
        ...req.body
      });
    //   sendEmail({
    //     otp: newUser.email_otp,
    //     email: newUser.email,
    //     project_name: process.env.PROJECT_NAME,
    //     type: "register",
    //     user: newUser,
    //   });

      return successRes(
        res,
        200,
        "OTP has been sent to your provided email",
        newUser
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password, device_token, device_type, device_model } =
        req.body;
      const user = await Model.User.findOne({
        email: email.toLowerCase(),
      });
      if (!user) {
        return errorRes(res, 404, "User doesn't exists");
      }
      if (!user.is_active) {
        return errorRes(
          res,
          400,
          "Your Account has been De-activated By Admin"
        );
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      // Check if the user is verified and active
      if (!user.email_verified) {
        user.email_otp = otp;
        await user.save();
        sendEmail({
          otp: otp,
          email: user.email,
          project_name: process.env.PROJECT_NAME,
          type: "register",
          user: user,
        });
        return successRes(
          res,
          200,
          "OTP has been sent to your provided email",
          user
        );
      }

      // Check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return errorRes(res, 400, "Invalid Password");
      }

      // Ensure JWT_SECRET_KEY is defined
      if (!JWT_SECRET_KEY) {
        return errorRes(res, 400, "JWT_SECRET_KEY is not defined");
      }

      // Generate JWT token
      const token = JWT.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "30d",
      });

      // Update device information
      user.device_token = device_token;
      user.device_model = device_model;
      user.device_type = device_type;
      user.email_otp = otp;
      await user.save();
      const responseObj = user.toObject();
      const response = {
        ...responseObj,
        token,
      };
      // Send response with user ID and token
      return successRes(res, 200, "User successfully login", response);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  forgetpassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Model.User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return errorRes(res, 404, "User Not Found");
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      user.email_otp = otp;
      const updateData = await user.save();
      sendEmail({
        otp: user.email_otp,
        email: user.email,
        project_name: process.env.PROJECT_NAME,
        type: "forgotPassword",
        user: user,
      });
      return successRes(
        res,
        200,
        "OTP has been sent to your provided email",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { userId, password } = req.body;

      if (!password) {
        return errorRes(res, 400, "Please Enter the Password");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await Model.User.findByIdAndUpdate(
        userId,
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        return errorRes(res, 400, "User Not Found");
      }
      return successRes(res, 200, "Password Updated Successfully", updatedUser);
    } catch (err) {
      // Handle errors
      return errorRes(res, 500, err.message);
    }
  },
  resendOTP: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await Model.User.findOne({ _id: userId });
      if (!user) {
        return errorRes(res, 404, "User Not Found");
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      const updateData = await Model.User.findByIdAndUpdate(
        userId,
        { $set: { email_otp: otp } },
        { new: true }
      );
      sendEmail({
        otp: otp,
        email: user.email,
        project_name: process.env.PROJECT_NAME,
        type: "resendOTP",
        user: user,
      });
      return successRes(
        res,
        200,
        "OTP has been Resent to your provided email",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { userId, otp } = req.body;
      const user = await Model.User.findOne({ _id: userId });
      if (!user) {
        return errorRes(res, 404, "User not found");
      }
      if (otp == user.email_otp) {
        user.email_verified = 1;
        const token = JWT.sign({ userId: user._id }, JWT_SECRET_KEY, {
          expiresIn: "30d",
        });
        const responseObj = user.toObject();
        const response = {
          ...responseObj,
          token,
        };
        await user.save();
        return successRes(res, 200, "Email verified successfully.", response);
      } else {
        return errorRes(res, 400, "Invalid OTP");
      }
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },


  

  dropTables: async (req, res) => {
    try {
      // await Model.Specialization.deleteMany({});
      await Model.Booking.deleteMany({});
      await Model.User.deleteMany({ role: 0 });
      // await Model.Shop.deleteMany({});
      await Model.Notification.deleteMany({});
      await Model.Chat.deleteMany({});
      await Model.ChatRoom.deleteMany({});
      await Model.readUnread.deleteMany({});
      return successRes(res, 200, "Deleted");
    } catch (error) {
      return errorRes(res, 500, err.message);
    }
  },
 
 

};

export default userServices;
