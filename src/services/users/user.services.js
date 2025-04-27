import { cars, indianRegions } from "../../constants/static.js";
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
      const {search} = req.query;
      let query = {is_payment_done: 1};
      if(search){
        query.vehicle_model = { $regex: search, $options: "i" };
      }
      const allVehicles = await Model.Vehicle.find(query).sort(
        { createdAt: -1 }
      );
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

      let result = cars;

      if (searchName) {
        const regex = new RegExp(searchName, "i");
        result = cars.filter((car) => regex.test(car.company));
      }
      //  delete result.models;
      const carsWithoutModels = result.map(({ models, ...rest }) => rest);
      return successRes(res, 200, "Car list", carsWithoutModels);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getModelList: async (req, res) => {
    try {
      const carName = req.query.car; // e.g., Honda
      const search = req.query.search; // e.g., civ

      if (!carName) {
        return errorRes(res, 400, "Car name is required");
      }

      // Find the car object
      const car = cars.find(
        (c) => c.company.toLowerCase() === carName.toLowerCase()
      );

      if (!car) {
        return errorRes(res, 404, "Car not found");
      }

      let models = car.models;

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
      const popularBrands = result.map(({ models, ...rest }) => rest);
      const mostlySearch = await Model.Search.find({}).sort({count: 1});
      let famousCars;
      if(mostlySearch.length< 5){
       famousCars = await Model.Vehicle.find({
        is_payment_done: 1,
        vehicle_type: 0,
      })
        .sort({ createdAt: -1 })
        .limit(6); 
      }else{
        let searchIds = mostlySearch.map((search)=> search?.vehicleId?.toString());
        famousCars = await Model.Vehicle.find({_id: {$in: searchIds}});
      }
      const bestValue = await Model.Vehicle.find({
        is_payment_done: 1,
        vehicle_type: 0,
      })
        .sort({ vehicle_price: 1 })
        .limit(6);
      const newlyAdded = await Model.Vehicle.find({
        is_payment_done: 1,
        vehicle_type: 0,
      })
        .sort({ createdAt: -1 })
        .limit(6);
      const allCars = await Model.Vehicle.find({
        is_payment_done: 1,
        vehicle_type: 0,
      });
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
      let response = {
        famousCars: famousCars,
        popularBrands: popularBrands,
        bestValue: bestValue,
        newlyAdded: newlyAdded,
        allStates: allStates
      };
      return successRes(res, 200, "Home data fetched successfully", response)
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
};
export default userServices;
