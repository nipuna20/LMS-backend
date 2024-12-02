const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const Post = require("../model/post");
const Course = require("../model/Course");
const ZoomOnlineSessions = require("../model/ZoomOnlineSessions");
const ZoomRecordings = require("../model/ZoomRecordings");

const router = express.Router();

// Admin Login
router.post("/User/adminLogin", async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = jwt.sign(
      { email: user.email, role: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      token,
      data: { email: user.email, role: user.isAdmin },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Password Update
router.post("/User/passwordUpdate", async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Deletion
router.delete("/User/delete", async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    await Admin.deleteOne({ email: req.body.email });

    res.status(200).json({ success: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Admin User
router.post("/AdminUserCreation", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAdmin = new Admin({ ...req.body, password: hashedPassword });

    await newAdmin.save();
    res.status(200).json({ success: "Admin user created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Posts
router.get("/post", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, existingPost: posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Post
router.put("/post/update/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json({ success: "Post updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Post
router.delete("/post/delete/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: "Post deleted successfully", deletedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Course
router.post("/course/save", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(200).json({ success: "Course saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Courses
router.get("/course", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, CoursesData: courses });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Course
router.put("/course/update/:id", async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json({ success: "Course updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Course
router.delete("/course/delete/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: "Course deleted successfully", deletedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Zoom Online Session
router.post("/OnlineSessions/zoom", async (req, res) => {
  try {
    const newSession = new ZoomOnlineSessions(req.body);
    await newSession.save();
    res.status(200).json({ success: "Zoom session saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Zoom Online Sessions
router.get("/OnlineSessions/zoom", async (req, res) => {
  try {
    const sessions = await ZoomOnlineSessions.find();
    res.status(200).json({ success: true, CoursesData: sessions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Zoom Online Session Links
router.post("/OnlineSessions/zoomLink/:id", async (req, res) => {
  try {
    const updatedSession = await ZoomOnlineSessions.findByIdAndUpdate(
      req.params.id,
      { $push: { links: req.body } },
      { new: true, runValidators: true }
    );

    if (!updatedSession) throw new Error("Session not found");
    res.status(200).json({ success: "Link added successfully", data: updatedSession });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Zoom Recording
router.post("/OnlineRecordings/zoom", async (req, res) => {
  try {
    const newRecording = new ZoomRecordings(req.body);
    await newRecording.save();
    res.status(200).json({ success: "Zoom recording saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Zoom Recordings
router.get("/OnlineRecordings/zoom", async (req, res) => {
  try {
    const recordings = await ZoomRecordings.find();
    res.status(200).json({ success: true, CoursesData: recordings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export router
module.exports = router;
