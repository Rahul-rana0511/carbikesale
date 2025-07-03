import express from "express";
import dotenv from "dotenv";
import http from 'http';
import { Server } from "socket.io";
import { connectSocket, getSocketIo } from "./src/sockets/sockets.js";
import morgan from "morgan";
import cors from "cors";
import swagger_ui from "swagger-ui-express"; 
import openapi_docs from "./output.openapi.json" assert { type: "json" };
import connectDB from "./src/config/dbConnection.js";
// import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/user.routes.js";

// ✅ Load env first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4045; // fallback port

// ✅ CORS should be here before any routes
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './views'); // make sure your .ejs file is in this folder
app.get('/support', (req, res) => {
  res.render('support', {
    supportEmail: 'gs.carbikehub@gmail.com'
  });
});
app.get('/privacy', (req, res) => {
  res.render('privacy', {
    appName: 'Car & Bike Hub',
    updatedDate: 'July 3, 2025'
  });
});

app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(morgan('dev'));

// ✅ Root Route
app.get('/', (req, res) => {
  res.status(200).json({ message: "very good", status: 200 });
});

// ✅ Routes (if needed later)
// app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// ✅ Swagger Docs
app.use("/docs", swagger_ui.serve, swagger_ui.setup(openapi_docs, {
  title: `Car & bike sale Documentation`
}));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
global.io = io;
connectSocket(io);
// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
