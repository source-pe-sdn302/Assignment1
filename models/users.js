const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const usersSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
