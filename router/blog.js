const express = require("express");
const {
  getBlog,
  sendPost,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  getUserBlog,
  addComment
} = require("../controller/blog");

const router = express.Router();

router.get("/getBlog", getBlog);
router.get("/getUserBlog/:id", getUserBlog);
router.post("/sendPost", sendPost);
router.patch("/update/:id", updateBlog);
router.get("/getBlog/:id", getSingleBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.post("/addComment/:id", addComment)

module.exports = router;
