const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler, NotFoundError } = require("@adeona-tech/common");
require("dotenv").config(); // Load environment variables

const app = express();

// MongoDB connection string
const DB_URL = process.env.MONGO_URI || "mongodb+srv://SampleUser1:SamplePW456@clusterforlms.amnj1.mongodb.net/LMS?retryWrites=true&w=majority&appName=ClusterForLMS";

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files (e.g., images)
app.use("/image", express.static("image"));

// MongoDB Connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};
connectDatabase();

// Routes
app.use("/api/v1/users", require("./routes/user"));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the LMS backend!",
  });
});

// Catch-all for undefined routes
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// Error handler
app.use(errorHandler);

module.exports = app;
