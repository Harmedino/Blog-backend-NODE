const express = require("express");
const {
  getUser,
  sendPost,
  updateBlog,
  getSingleBlog,
  deleteBlog,
} = require("../controller/blog");

const router = express.Router();

router.get("/getBlog", getUser);
router.post("/sendPost", sendPost);
router.patch("/update/:id", updateBlog);
router.get("/getBlog/:id", getSingleBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;
