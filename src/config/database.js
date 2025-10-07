const mongoose = require("mongoose");

const connectDB = async ()=> {
 await mongoose.connect(
  "mongodb+srv://jayasuryasurya933_db_user:jC6nlYAcEv3qrW3K@nodeproject.xzo1gg3.mongodb.net/"
);
}



module.exports = {connectDB}