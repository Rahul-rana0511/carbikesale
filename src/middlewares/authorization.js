import { errorRes } from '../utils/response.js';

const authorization = async (req, res, next) => {
  try {
     const role = req.user.role;
     if(role == 2){
        return errorRes(res, 403, "Acess denied, you are in a guest mode")
     }
     next()
  } catch (error) {
    console.error('Token verification failed:', error);
  }
};

export default authorization;