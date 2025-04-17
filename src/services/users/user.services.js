import * as Model from "../../models/index.js";
import { errorRes, successRes } from "../../utils/response.js";
import "dotenv/config";

const userServices = {
  addVehicle: async(req,res)=>{
    try{
     const addData = await Model.Vehicle.create({...req.body, userId: req.user._id});
     return successRes(res, 200, "Vehicle added successfully",addData)
    }catch(err){
        return errorRes(res, 500, err.message)
    }
  },
  dummyPayment: async(req,res)=>{
    try{
     const {vehicleId} = req.body;
     const updatePayment = await Model.Vehicle.findByIdAndUpdate(vehicleId,{$set:{is_payment_done: 1}},{new: true});
     return successRes(res, 200, "Vehicle payment done successfully", updatePayment)
    }catch(err){
        return errorRes(res, 500, err.message)
    }
  },
  getVehicles: async(req,res)=>{
    try{
      const allVehicles = await Model.Vehicle.find({is_payment_done: 1}).sort({createdAt: -1});
      return successRes(res, 200, "vehicle list fetched successfully", allVehicles)

    }catch(err){
        return errorRes(res, 500, err.message)
    }
  },
  getvehicleDetails : async(req,res)=>{

    try{
const {vehicleId} = req.params;
const vehicleDetails = await Model.Vehicle.findById(vehicleId).populate({path: "userId", select:"first_name last_name profile_image country_code phone_number"});
if(!vehicleDetails){
    return errorRes(res, 404, "Vehicle details not found")
}
return successRes(res, 200, "Vehicle details fetched successfully", vehicleDetails)
    }catch(err){
        return errorRes(res, 500, err.message)
    }
  }
}