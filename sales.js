import express from "express";
const app = express();
import dotenv from "dotenv";
import "dotenv/config";
import http from 'http';

import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/dbConnection.js";
// import adminRoutes from "./src/routes/adminRoutes.js";
// import userRoutes from "./src/routes/userRoutes.js";
//swaggerr---
// import swagger_ui from "swagger-ui-express"; 
// import openapi_docs from "./output.openapi.json" assert { type: "json" };

//swaggerr---
const PORT = process.env.PORT;
dotenv.config();  

connectDB();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
app.use(morgan('dev'));
app.get('/', (req, res) => {
   return res.status(200).json({message: "very goood", status: 200});
  });

// app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);


//swagger docs
// app.use("/docs", swagger_ui.serve, swagger_ui.setup(openapi_docs, {
//     title: `TrvlMinds Documentation`
// }));


app.listen(PORT, () => {
    console.log('Server listening on Port', PORT);
});