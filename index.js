require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController/errorController");
const { applySecurity } = require("./middleware/security");

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3300;

// ✅ Apply security before any other middleware
applySecurity(app);

// Logging
app.use(morgan(isProduction ? "combined" : "dev"));

// Basic parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server up and running",
    data: isProduction,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => console.log(`✅ Server running on PORT: ${port}`));
