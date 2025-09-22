require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController/errorController");
const { applySecurity } = require("./middleware/security");

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const port = process.env.PORT || 3300;

const frontendURL = isProduction
  ? "https://gracerouteltd.com"
  : "http://localhost:5173";

const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

// Apply global security middleware
applySecurity(app);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "server up and running", data: isProduction });
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Catch all unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// 🔹 Global error handler
app.use(globalErrorHandler);

app.listen(port, () => console.log(`Server running on PORT: ${port}`));
