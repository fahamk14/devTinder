const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://fahamkhan0908_db_user:yEjvaaJjBO4f2biL@namastenode.7lj3qmq.mongodb.net/"
  );
};

module.exports = connectDB;
