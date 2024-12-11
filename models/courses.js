const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const coursesSchema = new Schema({
  Title: String,
  Description: String,
  InstructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
  },
  list_reviews: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      reviewtext: String,
      rating: Number,
      reviewDate: String,
    },
  ],
});

const Courses = mongoose.model("courses", coursesSchema);

module.exports = Courses;
