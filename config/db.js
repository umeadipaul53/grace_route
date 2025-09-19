const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(`Failed to connect to DB due to error: ${err}`);
  });

module.exports = mongoose;
