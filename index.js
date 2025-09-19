require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const port = process.env.PORT || 3300;

const isProduction = process.env.NODE_ENV === "production";

const frontendURL = isProduction
  ? "https://grace-route-real-estate-company.onrender.com"
  : "http://localhost:5173";

app.use(
  cors({
    origin: frontendURL,
    credentials: true, // must match with Axios `withCredentials: true`
  })
);

const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "server up and running", data: isProduction });
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => console.log(`Server running on PORT: ${port}`));
