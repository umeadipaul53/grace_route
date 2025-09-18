require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 2206;

app.use(express.json());

const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

app.get("/", (req, res) => {
  res.status(200).json({ message: "server up and running" });
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => console.log(`Server running on PORT: ${port}`));
