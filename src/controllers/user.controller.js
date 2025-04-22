import authServices from "../services/users/auth.services.js";
import userServices from "../services/users/user.services.js";
const userController ={
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

}
export default userController