const mongoose = require("mongoose");
const Courses = require("./courses");
const Instructors = require("./instructors");
const Users = require("./users");

const db = {};
db.Courses = Courses;
db.Instructors = Instructors;
db.Users = Users;

// Define schema

module.exports = db;
