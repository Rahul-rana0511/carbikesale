import userServices from "../services/users/auth.services.js";

const userController ={
    register: async (req, res) => {
        await userServices.registerUser(req, res);
      },
}
export default userController