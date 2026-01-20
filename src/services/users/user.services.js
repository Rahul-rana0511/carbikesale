import { model } from "mongoose";
import { bikes, cars, indianRegions } from "../../constants/static.js";
import * as Model from "../../models/index.js";
import { errorRes, successRes } from "../../utils/response.js";
import Razorpay from "razorpay";
import "dotenv/config";
import pushNotification from "../../utils/notificationHandler.js";
import crypto from "crypto";
const userServices = {
  addPromocode: async (req, res) => {
    try {
      const addData = await Model.Promocode.create({
        ...req.body,
      });
      return successRes(res, 200, "Promo code added successfully", addData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
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
        { new: true },
      );
      if (!updateData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(
        res,
        200,
        "User profile updated successfully",
        updateData,
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
      // if (req.body.vehicle_number) {
      //   const vehicleNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
      //   if (!vehicleNumberRegex.test(req.body.vehicle_number)) {
      //     return errorRes(res, 400, "Please enter a valid vehicle number")
      //   }
      // }
      if (req.user.role == 1) {
        if (!req.user.license_number || req.user.license_number == null) {
          return errorRes(res, 400, "license number is required");
        }
      }
      if (req.body.vehicle_price) {
        let price = 0;
        let discount = 0;
        let paying_amount = 0;
        let vehicle_price = parseInt(req.body.vehicle_price);
        if (req.body.vehicle_type == 1) {
          if (vehicle_price > 0 && vehicle_price <= 50000) {
            price = 5;
          } else if (vehicle_price > 50000 && vehicle_price <= 100000) {
            price = 10;
          } else if (vehicle_price > 100000) {
            price = 15;
          }
        } else {
          if (vehicle_price > 0 && vehicle_price <= 200000) {
            price = 10;
          } else if (vehicle_price > 200000 && vehicle_price <= 500000) {
            price = 20;
          } else if (vehicle_price > 500000 && vehicle_price <= 1000000) {
            price = 30;
          } else if (vehicle_price > 1000000) {
            price = 50;
          }
        }

        paying_amount = price;
        if (req.body.promo_code) {
          const promoDetails = await Model.Promocode.findOne({
            code: req.body.promo_code,
          });

          if (!promoDetails) {
            return errorRes(res, 404, "Promo code not found or expired");
          }

          const alreadyUsed = promoDetails.usedBy?.map((user) =>
            user.toString(),
          );

          if (alreadyUsed?.includes(req.user._id.toString())) {
            return errorRes(res, 400, "You already used this promo code");
          }

          // ✅ Correct discount calculation
          const promoDiscount = (price * promoDetails.value) / 100;
          discount += promoDiscount;
          // ✅ Mark promo as used
          await Model.Promocode.updateOne(
            { _id: promoDetails._id },
            { $push: { usedBy: req.user._id } },
          );
        }else if (req.user.role == 1) {
          const roleDiscount = price * 0.1;
          discount += roleDiscount;
        }
        const total_payment = Math.max(price - discount, 0);
        req.body.post_paymnet = price;
        req.body.discount = discount;
        req.body.total_payment = total_payment;
      }
      const addData = await Model.Vehicle.create({
        ...req.body,
        userId: req.user._id,
      });
      // const users = await Model.User.find({ _id: { $ne: req.user._id } });
      // for (let user of users) {
      //   await pushNotification({
      //     user_id: user?._id,
      //     other_user: req.user._id,
      //     type: "vehicleAdded",
      //     misc: { redirectId: addData?._id },
      //   });
      // }
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
        { new: true },
      );
      return successRes(
        res,
        200,
        "Vehicle payment done successfully",
        updatePayment,
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
        allVehicles,
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
        vehicleDetails,
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
      const type = req.query.type; // 1 -> bike 0 -> car
      if (!vehicleName) {
        return errorRes(res, 400, "Vehicle name is required");
      }
      let vehicles;
      if (type) {
        vehicles = bikes.find(
          (c) => c.company.toLowerCase() === vehicleName.toLowerCase(),
        );
      } else {
        vehicles = cars.find(
          (c) => c.company.toLowerCase() === vehicleName.toLowerCase(),
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
      let result = [...cars, ...bikes];
      let allStates = indianRegions;
      const userId = req.user._id;
      const likedCarList = await Model.Likevehicle.find({ userId });
      const blockedUser = await Model.Block.find({
        blockBy: req.user._id,
      });
      const blockedUserIds = blockedUser.map((block) =>
        block?.blockTo?.toString(),
      );
      blockedUserIds.push(req.user._id.toString());
      const likeVehicleIds = likedCarList.map((like) =>
        like?.vehicleId?.toString(),
      );
      const popularBrands = result.map(({ models, ...rest }) => rest);
      const mostlySearch = await Model.Search.find({}).sort({ count: 1 });
      let famousCars;
      if (mostlySearch.length < 5) {
        famousCars = await Model.Vehicle.find({
          is_payment_done: 1,
          userId: { $nin: blockedUserIds },
          // vehicle_type: 0,
        })
          .sort({ createdAt: -1 })
          // .limit(6)
          .lean();
      } else {
        let searchIds = mostlySearch.map((search) =>
          search?.vehicleId?.toString(),
        );
        famousCars = await Model.Vehicle.find({
          _id: { $in: searchIds },
          userId: { $nin: blockedUserIds },
        }).lean();
      }
      const bestValue = await Model.Vehicle.find({
        is_payment_done: 1,
        userId: { $nin: blockedUserIds },
        // vehicle_type: 0,
      })
        .sort({ vehicle_price: 1 })
        // .limit(6)
        .lean();
      const newlyAdded = await Model.Vehicle.find({
        is_payment_done: 1,
        userId: { $nin: blockedUserIds },
        // vehicle_type: 0,
      })
        .sort({ createdAt: -1 })
        // .limit(6)
        .lean();
      const allCars = await Model.Vehicle.find({
        is_payment_done: 1,
        userId: { $nin: blockedUserIds },
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
          delVehicleFromLikedList,
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
        vehicleList,
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  buyVehicleList: async (req, res) => {
    try {
      const { type, sort, brand, model } = req.query;
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
      if (brand) {
        query.vehicle_brand = brand;
      }
      if (model) {
        query.vehicle_model = model;
      }
      const vehcileList = await Model.Vehicle.find(query)
        .sort(filterQuery)
        .lean();
      const likedCarList = await Model.Likevehicle.find({
        userId: req.user._id,
      });
      const likeVehicleIds = likedCarList.map((like) =>
        like?.vehicleId?.toString(),
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
  carBikeList: async (req, res) => {
    try {
      const vehicleList = await Model.Vehicle.find({ is_payment_done: 1 })
        .populate({
          path: "userId",
          select:
            "first_name last_name profile_image country_code phone_number",
        })
        .sort({ createdAt: -1 });
      const vehicleData = vehicleList.reduce(
        (acc, cur) => {
          if (cur.vehicle_type == 1) {
            acc.bikeList.push(cur);
          } else {
            acc.carList.push(cur);
          }
          return acc;
        },
        {
          carList: [],
          bikeList: [],
        },
      );
      return successRes(res, 200, "Bike car list", vehicleData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  switchAccount: async (req, res) => {
    try {
      const role = req.user.role;
      let newRole = role == 1 ? 0 : 1;
      const updateRole = await Model.User.findByIdAndUpdate(
        req.user._id,
        { $set: { role: newRole } },
        { new: true },
      );
      if (!updateRole) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(res, 200, `Role switched successfully`, updateRole);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  createPaymentIntent: async (req, res) => {
    try {
      const {
        amount,
        currency = "INR",
        receipt = `receipt_${Date.now()}`,
      } = req.body;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt,
      };

      const order = await razorpay.orders.create(options);
      order.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
      return successRes(res, 200, "Payment successful", order);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        const lastOrder = await Model.Vehicle.findOne({
          userId: req.user._id,
        }).sort({ createdAt: -1 });
        lastOrder.is_payment_done = 1;
        lastOrder.payment_id = razorpay_payment_id;
        await lastOrder.save();
        const users = await Model.User.find({ _id: { $ne: req.user._id } });
        for (let user of users) {
          await pushNotification({
            user_id: user?._id,
            other_user: req.user._id,
            type: "vehicleAdded",
            misc: { redirectId: lastOrder?._id },
          });
        }
        return successRes(res, 200, "Payment verified successfully");
      } else {
        return errorRes(res, 400, "Payment verification failed");
      }
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  addReviews: async (req, res) => {
    try {
      const isReveiwExists = await Model.Review.findOne({
        userId: req.user._id,
      });
      if (isReveiwExists) {
        return errorRes(res, 404, "Review already exists");
      }
      const addReview = await Model.Review.create({
        ...req.body,
        userId: req.user._id,
      });
      return successRes(res, 200, "Review added successfully", addReview);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getReviews: async (req, res) => {
    try {
      const allReviews = await Model.Review.find({})
        .populate({
          path: "userId",
          select: "first_name  last_name profile_image",
        })
        .sort({ createdAt: -1 });
      return successRes(res, 200, "Reveiw fetched successfully", allReviews);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  myvehicles: async (req, res) => {
    try {
      const vehicleList = await Model.Vehicle.find({
        userId: req.user._id,
        is_payment_done: 1,
      }).sort({ createdAt: -1 });

      return successRes(res, 200, "Review added successfully", vehicleList);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  delVehicle: async (req, res) => {
    try {
      const delData = await Model.Vehicle.findByIdAndDelete(
        req.params.vehicleId,
      );
      if (!delData) {
        return errorRes(res, 404, "Vehicle details not found");
      }
      return successRes(res, 200, "Vehicle deleted successfully", delData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  editVehicle: async (req, res) => {
    try {
      if (req.body.lat && req.body.long) {
        req.body.location = {
          type: "Point",
          coordinates: [req.body.long, req.body.lat],
        };
      }
      // if (req.body.vehicle_number) {
      //   const vehicleNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
      //   if (!vehicleNumberRegex.test(req.body.vehicle_number)) {
      //     return errorRes(res, 400, "Please enter a valid vehicle number")
      //   }
      // }

      const updateData = await Model.Vehicle.findByIdAndUpdate(
        req.body.vehcileId,
        {
          $set: {
            ...req.body,
          },
        },
        { new: true },
      );
      if (!updateData) {
        return errorRes(res, 404, "Vehicle details not found");
      }
      return successRes(
        res,
        200,
        "Vehicle details updated successfully",
        updateData,
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  popularModelList: async (req, res) => {
    try {
      const vehcileData = [...cars, ...bikes];
      let modelList = [];
      for (let vehicle of vehcileData) {
        modelList.push(...vehicle.models);
      }
      //  const searchList = await Model.Search.find({}).populate({path: "vehicleId", select: "vehicle_model"});

      // for(let search of searchList){
      //   if(!(modelList.includes(search?.vehicleId?.vehicle_model))){
      //    modelList.push(search?.vehicleId?.vehicle_model)
      //   }
      // }
      // if(modelList.length < 8){
      //   let removeVehicles = searchList.map((search)=> search?.vehicleId?.toString())
      //   const allVehicles = await Model.Vehicle.find({_id: {$nin: removeVehicles}});
      //     for(let search of allVehicles){
      //   if(!(modelList.includes(search?.vehicle_model))){
      //    modelList.push(search?.vehicle_model)
      //   }
      //   if(modelList.length >= 8){
      //     break;
      //   }
      // }
      // }
      return successRes(res, 200, "Search model list", modelList);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getNotification: async (req, res) => {
    try {
      const myNotifications = await Model.Notification.find({
        user_id: req.user._id,
      }).sort({ createdAt: -1 });
      return successRes(res, 200, "Notification Listing", myNotifications);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  updateNotification: async (req, res) => {
    try {
      const notification_toggle = req.user.is_enable_notification == 1 ? 0 : 1;
      const updateData = await Model.User.findByIdAndUpdate(
        req.user._id,
        { $set: { ...req.body, is_enable_notification: notification_toggle } },
        { new: true },
      );
      if (!updateData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(
        res,
        200,
        "Notification settings updated successfully",
        updateData,
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
};

export default userServices;
