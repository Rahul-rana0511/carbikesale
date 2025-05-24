import * as Model from "../../models/index.js";
import { errorRes, successRes } from "../../utils/response.js";
import { getSocketIo } from "../../sockets/sockets.js";
import pushNotification from "../../utils/notificationHandler.js";
export const chatService = {
  uploadMedia: async (req, res) => {
    try {
      let media;
      if (req.files && req.files?.media) {
        media = `public/${req.files["media"][0].filename}`;
      }
      return successRes(res, 200, "Media Content", media);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  createChatRoom: async (req, res) => {
    try {
      const userId = req.user._id;
      const { created_with } = req.body;
      if (userId.toString() === created_with.toString()) {
        return errorRes(res, 404, "You can't create room with yourself");
      }
      const isChatroomExists = await Model.ChatRoom.findOne({
        created_by: {
          $in: [created_with, userId],
        },
        created_with: {
          $in: [created_with, userId],
        },
      });

      if (isChatroomExists) {
        return successRes(res, 200, "Chat Room", isChatroomExists);
      } else {
        const createRoom = await Model.ChatRoom.create({
          created_by: userId,
          created_with: created_with
        });
        return successRes(res, 200, "Chat Room", createRoom);
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  sendMessage: async (data) => {
    try {
      let new_message = await Model.Chat.create({
        sender_id: data?.sender_id,
        room_id: data?.room_id,
        message_type: data?.message_type,
        message: data?.message,
      });
      const chatRoomData = await Model.ChatRoom.findOneAndUpdate(
        { _id: data?.room_id },
        { $set: { last_message: new_message?._id } },
        { new: true }
      );
      console.log(chatRoomData, "record");
      let userIds = [];
      if (data?.sender_id?.toString() == chatRoomData?.created_by?.toString()) {
        userIds.push(chatRoomData?.created_with?.toString());
      } else {
        userIds.push(chatRoomData?.created_by?.toString());
      }
      console.log(userIds, "record");
      await Model.readUnread.findOneAndUpdate(
        { user_id: data?.sender_id, room_id: data?.room_id, status: 0 },
        { $set: { status: 1 } },
        { new: true }
      );

      await Promise.all(
        userIds?.map(async (userId) => {
          await Model.readUnread.create({
            user_id: userId,
            room_id: data?.room_id,
            message_id: new_message?._id || null,
            status: 0,
          });
          await pushNotification({
            user_id: userId,
            other_user: data?.sender_id,
            type: "newMessage",
            misc:{redirectId: data?.room_id}
          });
        })
      );
      let data_message = await Model.Chat.findById(new_message?._id)
        .populate([
          {
            path: "sender_id",
            select: "first_name last_name profile_image",
          },
        ])
        .lean();
      data_message.userIds = userIds || [];
      console.log(data_message, "data");
      return data_message;
    } catch (error) {
      return error.message;
    }
  },
  getMessage: async (req, res) => {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        return successRes(res, 200, "Chat Data", []);
      }
    //   let isBlocked = 0,
    //     blockBy = null;
      const chatRoomData = await Model.ChatRoom.findById(roomId);
      if (!chatRoomData) {
        return errorRes(res, 404, "Room not found");
      }
    //   const isRoomBlocked = await Model.Block.findOne({
    //     room_id: roomId,
    //   }).populate({ path: "blockBy", select: "name" });
    //   if (isRoomBlocked) {
    //     isBlocked = 1;
    //     blockBy = isRoomBlocked?.blockBy;
    //   } else {
    //     isBlocked = 0;
    //   }
      const message_data = await Model.Chat.find({ room_id: roomId })
        .populate({
          path: "sender_id",
          select: "first_name last_name profile_image",
        })
        .sort({ createdAt: -1 });
      const filtered_data = message_data.filter(
        (message) =>
          !message.deleted_by ||
          !message.deleted_by.includes(req.user._id.toString())
      );

      if (filtered_data.length > 0) {
        await Model.readUnread.updateMany(
          { user_id: req.user._id, room_id: roomId, status: 0 },
          { $set: { status: 1 } },
          { new: true }
        );
        const response = {
          filtered_data: filtered_data,
        //   isBlocked: isBlocked,
        //   blockBy: blockBy,
        //   isAccepted,
        };
        return successRes(res, 200, "Chat Data", response);
      } else {
        return successRes(res, 200, "Chat Data", []);
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getRoom: async (req, res) => {
    try {
      let { search } = req.query;
      let query = {
        $and: [
          {
            $or: [
              { created_by: req.user._id},
              { created_with: req.user._id}
            ],
            last_message: { $exists: true },
          },
        ],
      };
  
      if (search && search != undefined) {
        let userSearch = await Model.User.find({
          first_name: { $regex: search, $options: "i" },
        });
        if (userSearch.length > 0) {
          let userIDs = userSearch.map((user) => user._id);
          query.$and.push({
            $or: [
              { created_by: { $in: userIDs } },
              { created_with: { $in: userIDs } },
            ],
          });
        } else {
          // If no users match the search, return an empty array
          return successRes(res, 200, "No result found", []);
        }
      }
      let existsRooms = await Model.ChatRoom.find(query)
        .populate([
          {
            path: "created_by",
            select: "first_name profile_image email last_name",
          },
          {
            path: "created_with",
            select: "first_name profile_image email last_name",
          },
          { path: "last_message" },
        ])
        .sort({ updatedAt: -1 })
        .lean();
      if (existsRooms.length === 0) {
        return successRes(res, 200, "Chat Room", []);
      }
      for (let existsRoom of existsRooms) {
        const unread_count = await Model.readUnread.countDocuments({
          user_id: req.user._id,
          room_id: existsRoom._id,
          status: 0,
        });
        existsRoom.unread_count = unread_count

        const isLastMessageDeleted = await Model.Chat.findOne({
          _id: existsRoom?.last_message?._id,
          deleted_by: { $in: [req.user._id] },
        });
        if (isLastMessageDeleted) {
          const dynamicLastMessage = await Model.Chat.findOne(
            {
              room_id: existsRoom._id,
              deleted_by: { $nin: [req.user._id] },
            },
            null,
            { sort: { createdAt: -1 } } 
          )
            .lean(); 
          
          if(!dynamicLastMessage){
            existsRoom.last_message = null;
      
          }else{
            existsRoom.last_message = dynamicLastMessage
          }
        }
      }
      existsRooms = existsRooms.filter((room) => room.last_message !== null);
      console.log(existsRooms,"here")
      return successRes(
        res,
        200,
        "Chat Room Fetched Successfully",
        existsRooms
      );
    } catch (error) {
      console.log(error.message)
      return errorRes(res, 500, error.message);
    }
  },
  clearChat: async (req, res) => {
    try {
      const userId = req.user._id;
      const { room_id } = req.body;
      await Model.Chat.updateMany(
        { room_id: room_id },
        {
          $addToSet: { deleted_by: userId },
        }
      );
      return successRes(res, 200, "Chats Deleted Successfully");
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  

  blockUnblockUser: async (req, res) => {
    try {
      const { userId, reason, desc, type, room_id } = req.body;
      const isAlreadyBlocked = await Model.Block.findOne({
        blockBy: req.user._id,
        blockTo: userId,
        roomId: room_id,
      });
      const userDetails = await Model.User.findById(userId);
      if (!userDetails) {
        return errorRes(res, 404, "User not found");
      }
      const isAlreadyReported = await Model.Report.findOne({
        reportBy: req.user._id,
        reportTo: userId,
        roomId: room_id,
        status: 0,
      });
      if (type == 1) {
        if (isAlreadyBlocked) {
          return errorRes(res, 400, "User already blocked");
        }
        const blockUser = await Model.Block.create({
          blockBy: req.user._id,
          blockTo: userId,
          reason,
          desc,
          roomId: room_id,
        });
        await Model.Report.create({
          reportBy: req.user._id,
          reportTo: userId,
          reason,
          desc,
          roomId: room_id,
          type: 3,
        });
        let io = getSocketIo();
        io.to(userDetails?.socketId).emit("user_blocked");
        return successRes(
          res,
          200,
          "User blocked & reported successfully",
          blockUser
        );
      } else if (type == 2) {
        if (isAlreadyBlocked) {
          return errorRes(res, 400, "User already blocked");
        }
        const blockUser = await Model.Block.create({
          blockBy: req.user._id,
          blockTo: userId,
          reason,
          desc,
          roomId: room_id,
        });
        let io = getSocketIo();
        io.to(userDetails?.socketId).emit("user_blocked");
        return successRes(res, 200, "User blocked successfully", blockUser);
      } else if (type == 3) {
        if (isAlreadyReported) {
          return errorRes(res, 400, "User already reported");
        }
        const reportUser = await Model.Report.create({
          reportBy: req.user._id,
          reportTo: userId,
          reason,
          desc,
          roomId: room_id,
          type: 3,
        });
        return successRes(res, 200, "User reported successfully", reportUser);
      } else if (type == 4) {
        const deleteBlockRecord = await Model.Block.findOneAndDelete({
          blockBy: req.user._id,
          blockTo: userId,
        });
        return successRes(
          res,
          200,
          "User unblocked successfully",
          deleteBlockRecord
        );
      }
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  blockUserList: async (req, res) => {
    try {
      const blockedUser = await Model.Block.find({
        block_by: req.user._id,
      })
        .populate({ path: "block_to", select: "user_name profile_image name" })
        .sort({ createdAt: -1 });
      return successRes(res, 200, "Blocked user list", blockedUser);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  deleteMessage : async (req, res) => {
    try {
      const userId = req.user._id;
      const {messageIds} = req.body;
      console.log(messageIds,"ids")
      await Model.Chat.updateMany(
        { _id: {$in: messageIds} },
        {
          $addToSet: { deleted_by: userId },
        }
      );
      return successRes(res, 200, "Messages Deleted Successfully");
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  }
};