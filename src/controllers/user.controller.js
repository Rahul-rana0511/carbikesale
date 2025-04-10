import userServices from "../services/users/auth.services.js";

const userController ={
  dropTables: async (req, res) => {
    await userServices.dropTables(req, res);
  },
  uploadImages: async (req, res) => {
    await userServices.uploadImages(req, res);
  },
    register: async (req, res) => {
        await userServices.registerUser(req, res);
      },
      login: async (req, res) => {
        await userServices.login(req, res);
      },
      forgetpassword: async (req, res) => {
        await userServices.forgetpassword(req, res);
      },
      resetPassword: async (req, res) => {
        await userServices.resetPassword(req, res);
      },
      resendOTP: async (req, res) => {
        await userServices.resendOTP(req, res);
      },
      verifyOTP: async (req, res) => {
        await userServices.verifyOTP(req, res);
      },


}
export default userController