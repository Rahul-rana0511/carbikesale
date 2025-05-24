import jwt from 'jsonwebtoken';
import * as Model from "../models/index.js";
import 'dotenv/config';
import {chatService} from '../../src/services/users/chat.services.js';
let onlineUsers = [];

global.onlineUsers = onlineUsers;

export const connectSocket = async (io)=> {
  io.on("connection", async(socket) => {
    const token = socket?.handshake?.headers?.authorization;
    console.log(token, "token")
    let user;
    if(token){
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
       user = await Model.User.findById(userId);
      if(user){
        // user.is_online = 1;
         user.socketId = socket.id
        await user.save();
      }
    }
   
    console.log(`User connected with this id ${socket.id}`);
    socket.on('send_message', async (msg) => {
      const chatdata = await chatService.sendMessage(msg);
      if (chatdata != undefined) {
        let userIds = chatdata?.userIds;
        for(let userId of userIds){
          const user = await Model.User.findById(userId).select("socketId")
            io.to(user.socketId).emit("receive_message", chatdata) 
        }
      }
    });


    socket.on("send_support", async (supportObj) => {
      supportObj.time = new Date();

      const supportmsg = await saveSupportMessage(supportObj);
      const support_id = supportObj?.support_id;

      await io.emit(support_id, supportmsg);
    });
    socket.on("start_map_time", async () => {
       if(user){
        if(user.is_started != 1){
          const date = new Date();
          const expiryDate = new Date(date.getTime() + 30 * 60000);
          user.free_trial_expiry = expiryDate;
          user.is_started = 1;
          await user.save()
        }
       }
      await io.to(user?.socketId).emit("time_started");
    });

    socket.on("disconnect", async() => {
      if(user){
        user.is_online = 0;
        user.socketId = null;
        await user.save();
      }
      console.log("disconnected", socket.id);
    });
  });
}; 
export const getSocketIo = () => {
  if (!io) {
      throw new Error("Socket.io is not initialized");
  }
  return io;
};