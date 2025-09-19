const express = require("express");
const user_route = express.Router();
const userReg = require("../controller/user_controller");

user_route.route("/register").post(userReg);

module.exports = user_route;
