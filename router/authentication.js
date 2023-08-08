const express = require("express");

const { register } = require("../controller/blog");
const verifyToken = require("../middleware/jwttokencheck");

const router = express.Router();

router.post("/register", register);
router.post("/verifyToken", verifyToken);

module.exports = router;
