const express = require("express");
const {
  getBlog,
  sendPost,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  getUserBlog
} = require("../controller/blog");

const router = express.Router();

router.get("/getBlog", getBlog);
router.get("/getUserBlog/:id", getUserBlog);
router.post("/sendPost", sendPost);
router.patch("/update/:id", updateBlog);
router.get("/getBlog/:id", getSingleBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;
