const express = require("express");
const db = require("../models");

const ApiRouter = express.Router();

ApiRouter.get("/courses", async (req, res, next) => {
  try {
    const courses = await db.Courses.find().populate("InstructorId");
    const count = await db.Courses.countDocuments();
    res.status(200).json({
      NumberOfCourses: count,
      Courses: courses.map((c) => {
        return {
          Title: c.Title,
          Description: c.Description,
          Instructor: {
            FullName: c.InstructorId.FirstName + "" + c.InstructorId.LastName,
            bio: c.InstructorId.bio,
          },
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

ApiRouter.get("/course/:courseId", async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const cours = await db.Courses.findById(courseId)
      .populate("InstructorId")
      .populate("list_reviews.user_id");
    if (!cours) {
      return res.status(500).json({
        error: {
          status: 500,
          message: `CourseId: ${courseId} does not exist`,
        },
      });
    }
    res.status(200).json({
      Title: cours.Title,
      Description: cours.Description,
      Instructor: {
        FullName:
          cours.InstructorId.FirstName + "" + cours.InstructorId.LastName,
        bio: cours.InstructorId.bio,
      },
      Reviews: cours.list_reviews.map((r) => {
        return {
          username: r.user_id.username,
          password: r.user_id.password,
          reviewtext: r.reviewtext,
          rating: r.rating,
          reviewDate: r.reviewDate,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

ApiRouter.put("/course/:courseId/review", async (req, res, next) => {
  try {
    const data = req.body;

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email) ||
      data.password.length < 8
    ) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Invalid email or password",
        },
      });
    }
    const courseId = req.params.courseId;
    const cours = await db.Courses.findById(courseId)
      .populate("InstructorId")
      .populate("list_reviews.user_id");
    if (!cours) {
      return res.status(500).json({
        error: {
          status: 500,
          message: `CourseId: ${courseId} does not exist`,
        },
      });
    }
    const usernameInput = data.username;
    const usernameExist = await db.Users.findOne({
      username: usernameInput,
    });
    if (!usernameExist) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Username does not exist",
        },
      });
    }
    const reviewExist = cours.list_reviews.find(
      (review) =>
        review.user_id.username.toString() === usernameExist.username.toString()
    );
    if (reviewExist) {
      return res.status(500).json({
        error: {
          status: 500,
          message: "User has already reviewed this course",
        },
      });
    }
    await db.Users.findOneAndUpdate(usernameExist._id, {
      $set: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });

    const courseUpdated = await db.Courses.findByIdAndUpdate(
      courseId,
      {
        $push: {
          list_reviews: {
            user_id: usernameExist._id,
            reviewtext: data.reviewtext,
            rating: data.rating,
            reviewDate: Date.now(),
          },
        },
      },
      { new: true }
    );
    res.status(200).json(courseUpdated);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});
module.exports = ApiRouter;
