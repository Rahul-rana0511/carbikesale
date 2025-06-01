import { model } from "mongoose";
import { bikes, cars, indianRegions } from "../../constants/static.js";
import * as Model from "../../models/index.js";
import { errorRes, successRes } from "../../utils/response.js";
import "dotenv/config";

const userServices = {
  getProfile: async (req, res) => {
    try {
      const getData = await Model.User.findById(req.user._id);
      if (!getData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(res, 200, "User profile fetched successfully", getData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const updateData = await Model.User.findByIdAndUpdate(
        req.user._id,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!updateData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(
        res,
        200,
        "User profile updated successfully",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  addVehicle: async (req, res) => {
    try {
      console.log(req.user);
      if (req.body.lat && req.body.long) {
        req.body.location = {
          type: "Point",
          coordinates: [req.body.long, req.body.lat],
        };
      }
      if (req.body.vehicle_price) {
        const price = parseFloat(req.body.vehicle_price);
        let paying_amount = price * 0.02; //Taking 2% for the post
        let discount =
          req.user.role == 1 ? paying_amount * 0.05 : paying_amount * 0.1;
        req.body.post_paymnet = paying_amount;
        req.body.total_payment = paying_amount - discount;
        req.body.discount = discount;
      }
      const addData = await Model.Vehicle.create({
        ...req.body,
        userId: req.user._id,
      });
      return successRes(res, 200, "Vehicle added successfully", addData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  dummyPayment: async (req, res) => {
    try {
      const { vehicleId } = req.body;
      const updatePayment = await Model.Vehicle.findByIdAndUpdate(
        vehicleId,
        { $set: { is_payment_done: 1 } },
        { new: true }
      );
      return successRes(
        res,
        200,
        "Vehicle payment done successfully",
        updatePayment
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getVehicles: async (req, res) => {
    try {
      const { search } = req.query;
      let query = { is_payment_done: 1 };
      if (search) {
        query.vehicle_model = { $regex: search, $options: "i" };
      }
      const allVehicles = await Model.Vehicle.find(query).sort({
        createdAt: -1,
      });
      return successRes(
        res,
        200,
        "vehicle list fetched successfully",
        allVehicles
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getvehicleDetails: async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const vehicleDetails = await Model.Vehicle.findById(vehicleId).populate({
        path: "userId",
        select: "first_name last_name profile_image country_code phone_number",
      });
      if (!vehicleDetails) {
        return errorRes(res, 404, "Vehicle details not found");
      }
      return successRes(
        res,
        200,
        "Vehicle details fetched successfully",
        vehicleDetails
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getCarList: async (req, res) => {
    try {
      const searchName = req.query.search;
      const { type } = req.query;
      let result;
      if (type == 1) {
        result = bikes;
        if (searchName) {
          const regex = new RegExp(searchName, "i");
          result = bikes.filter((bike) => regex.test(bike.company));
        }
      } else {
        result = cars;

        if (searchName) {
          const regex = new RegExp(searchName, "i");
          result = cars.filter((car) => regex.test(car.company));
        }
      }
      //  delete result.models;
      const vehiclesWithoutModels = result.map(({ models, ...rest }) => rest);
      return successRes(res, 200, "Car list", vehiclesWithoutModels);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getModelList: async (req, res) => {
    try {
      const vehicleName = req.query.car; // e.g., Honda
      const search = req.query.search; // e.g., civ
      const type = req.query.type // 1 -> bike 0 -> car
      if (!vehicleName) {
        return errorRes(res, 400, "Vehicle name is required");
      }
      let vehicles;
      if(type){
        vehicles = bikes.find(
        (c) => c.company.toLowerCase() === vehicleName.toLowerCase()
      ); 
      }else{
         vehicles = cars.find(
        (c) => c.company.toLowerCase() === vehicleName.toLowerCase()
      );
      }

      if (!vehicles) {
        return errorRes(res, 404, "Vehicle models not found");
      }

      let models = vehicles.models;

      // If search is present, filter the models
      if (search) {
        const regex = new RegExp(search, "i");
        models = models.filter((model) => regex.test(model));
      }

      return successRes(res, 200, "Model list", models);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getStateList: async (req, res) => {
    try {
      const searchName = req.query.search;

      let result = indianRegions;

      if (searchName) {
        const regex = new RegExp(searchName, "i");
        result = indianRegions.filter((india) => regex.test(india.name));
      }

      return successRes(res, 200, "Car list", result);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  homeScreen: async (req, res) => {
    try {
      let result = cars;
      let allStates = indianRegions;
      const userId = req.user._id;
      const likedCarList = await Model.Likevehicle.find({ userId });
      const likeVehicleIds = likedCarList.map((like) =>
        like?.vehicleId?.toString()
      );
      const popularBrands = result.map(({ models, ...rest }) => rest);
      const mostlySearch = await Model.Search.find({}).sort({ count: 1 });
      let famousCars;
      if (mostlySearch.length < 5) {
        famousCars = await Model.Vehicle.find({
          is_payment_done: 1,
          // vehicle_type: 0,
        })
          .sort({ createdAt: -1 })
          // .limit(6)
          .lean();
      } else {
        let searchIds = mostlySearch.map((search) =>
          search?.vehicleId?.toString()
        );
        famousCars = await Model.Vehicle.find({
          _id: { $in: searchIds },
        }).lean();
      }
      const bestValue = await Model.Vehicle.find({
        is_payment_done: 1,
        // vehicle_type: 0,
      })
        .sort({ vehicle_price: 1 })
        // .limit(6)
        .lean();
      const newlyAdded = await Model.Vehicle.find({
        is_payment_done: 1,
        // vehicle_type: 0,
      })
        .sort({ createdAt: -1 })
        // .limit(6)
        .lean();
      const allCars = await Model.Vehicle.find({
        is_payment_done: 1,
        // vehicle_type: 0,
      }).lean();
      for (let state of allStates) {
        let count = 0;
        allCars.map((car) => {
          if (car?.state == state) {
            count += 1;
          }
          return count;
        });
        state.count = count;
      }
      for (let car of famousCars) {
        let is_liked = 0;
        if (likeVehicleIds.includes(car?._id?.toString())) {
          is_liked = 1;
        }
        car.is_liked = is_liked;
      }
      for (let car of bestValue) {
        let is_liked = 0;
        if (likeVehicleIds.includes(car?._id?.toString())) {
          is_liked = 1;
        }
        car.is_liked = is_liked;
      }
      for (let car of newlyAdded) {
        let is_liked = 0;
        if (likeVehicleIds.includes(car?._id?.toString())) {
          is_liked = 1;
        }
        car.is_liked = is_liked;
      }
      let response = {
        famousCars: famousCars,
        popularBrands: popularBrands,
        bestValue: bestValue,
        newlyAdded: newlyAdded,
        allStates: allStates,
      };
      return successRes(res, 200, "Home data fetched successfully", response);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  likeDislikeVehicle: async (req, res) => {
    try {
      const userId = req.user._id;
      const { vehicleId, type } = req.body;
      if (type == 1) {
        const isVehicleAlreadyLiked = await Model.Likevehicle.findOne({
          vehicleId,
          userId,
        });
        if (isVehicleAlreadyLiked) {
          return errorRes(res, 400, "You already liked the vehicle");
        }
        const createRecord = await Model.Likevehicle.create({
          vehicleId,
          userId,
        });
        return successRes(res, 200, "vehicle liked successfully", createRecord);
      } else {
        const delVehicleFromLikedList =
          await Model.Likevehicle.findOneAndDelete({ vehicleId, userId });
        if (!delVehicleFromLikedList) {
          return errorRes(res, 404, "Record not found");
        }
        return successRes(
          res,
          200,
          "Vehicle removed from liked list",
          delVehicleFromLikedList
        );
      }
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  shortlistedVehicle: async (req, res) => {
    try {
      const userId = req.user._id;
      const vehicleList = await Model.Likevehicle.find({ userId })
        .populate("vehicleId")
        .sort({ createdAt: -1 });

      return successRes(
        res,
        200,
        "Shortlisted vehicles fetched successfully",
        vehicleList
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  buyVehicleList: async (req, res) => {
    try {
      const { type, sort } = req.query;
      let query = { is_payment_done: 1 };
      let filterQuery = { vehicle_price: 1 };
      if (type == 1) {
        query.vehicle_type = 0;
      } else if (type == 2) {
        query.vehicle_type = 1;
      }
      if (sort == 1) {
        filterQuery.vehicle_price = -1;
      }
      const vehcileList = await Model.Vehicle.find(query)
        .sort(filterQuery)
        .lean();
      const likedCarList = await Model.Likevehicle.find({
        userId: req.user._id,
      });
      const likeVehicleIds = likedCarList.map((like) =>
        like?.vehicleId?.toString()
      );
      for (let car of vehcileList) {
        let is_liked = 0;
        if (likeVehicleIds.includes(car?._id?.toString())) {
          is_liked = 1;
        }
        car.is_liked = is_liked;
      }
      return successRes(res, 200, "Vehicle fetched successfully", vehcileList);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  carBikeList: async(req,res)=>{
    try{
      const vehicleList = await Model.Vehicle.find({is_payment_done: 1}).populate({
        path: "userId",
        select: "first_name last_name profile_image country_code phone_number",
      }).sort({createdAt: -1});
      const vehicleData = vehicleList.reduce((acc, cur)=>{
         if(cur.vehicle_type == 1){
          acc.bikeList.push(cur)
         }else{
          acc.carList.push(cur)
         }
         return acc;
      },{
        carList: [],
        bikeList: []
      });
     return successRes(res, 200, "Bike car list", vehicleData)
    }catch (err) {
      return errorRes(res, 500, err.message);
    }
  }
};

export default userServices;
