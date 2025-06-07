import authServices from "../services/users/auth.services.js";
import userServices from "../services/users/user.services.js";
import { chatService } from "../services/users/chat.services.js";
const userController = {
  dropTables: async (req, res) => {
    await authServices.dropTables(req, res);
  },
  uploadImages: async (req, res) => {
    await authServices.uploadImages(req, res);
  },
  register: async (req, res) => {
    await authServices.registerUser(req, res);
  },
  login: async (req, res) => {
    await authServices.login(req, res);
  },
  forgetpassword: async (req, res) => {
    await authServices.forgetpassword(req, res);
  },
  resetPassword: async (req, res) => {
    await authServices.resetPassword(req, res);
  },
  resendOTP: async (req, res) => {
    await authServices.resendOTP(req, res);
  },
  verifyOTP: async (req, res) => {
    await authServices.verifyOTP(req, res);
  },
  getCarList: async (req, res) => {
    await userServices.getCarList(req, res);
  },
  getModelList: async (req, res) => {
    await userServices.getModelList(req, res);
  },
  getStateList: async (req, res) => {
    await userServices.getStateList(req, res);
  },
  addVehicle: async (req, res) => {
    await userServices.addVehicle(req, res);
  },
  dummyPayment: async (req, res) => {
    await userServices.dummyPayment(req, res);
  },
  updateProfile: async (req, res) => {
    await userServices.updateProfile(req, res);
  },
  getProfile: async (req, res) => {
    await userServices.getProfile(req, res);
  },
  getvehicleDetails: async (req, res) => {
    await userServices.getvehicleDetails(req, res);
  },
  getVehicles: async (req, res) => {
    await userServices.getVehicles(req, res);
  },
  homeScreen: async (req, res) => {
    await userServices.homeScreen(req, res);
  },
  likeDislikeVehicle: async (req, res) => {
    await userServices.likeDislikeVehicle(req, res);
  },
  shortlistedVehicle: async (req, res) => {
    await userServices.shortlistedVehicle(req, res);
  },
  buyVehicleList: async (req, res) => {
    await userServices.buyVehicleList(req, res);
  },
  carBikeList: async (req, res) => {
    await userServices.carBikeList(req, res);
  },
  createChatRoom: async (req, res) => {
    await chatService.createChatRoom(req, res);
  },
  getMessage: async (req, res) => {
    await chatService.getMessage(req, res);
  },
  getRoom: async (req, res) => {
    await chatService.getRoom(req, res);
  },
  clearChat: async (req, res) => {
    await chatService.clearChat(req, res);
  },
  blockUserList: async (req, res) => {
    await chatService.blockUserList(req, res);
  },
  blockUnblockUser: async (req, res) => {
    await chatService.blockUnblockUser(req, res);
  },
  switchAccount: async (req, res) => {
    await userServices.switchAccount(req, res);
  },
   addReviews: async (req, res) => {
    await userServices.addReviews(req, res);
  },
   getReviews: async (req, res) => {
    await userServices.getReviews(req, res);
  },
};
export default userController;
