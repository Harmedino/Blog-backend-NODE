const express = require("express");
const { getUser, sendPost, updateBlog } = require("../controller/blog");

const router = express.Router();

router.get("/getBlog", getUser);
router.post("/sendPost", sendPost);
router.patch("/update/:id", updateBlog);

module.exports = router;
