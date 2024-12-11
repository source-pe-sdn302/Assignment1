const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const instructorsSchema = new Schema({
  FullName: {
    FirstName: String,
    LastName: String,
  },
  bio: String,
});

const Instructors = mongoose.model("instructors", instructorsSchema);

module.exports = Instructors;
