const express = require("express");

const { register, getAuth } = require("../controller/blog");
const verifyToken = require("../middleware/jwttokencheck");

const router = express.Router();

router.post("/register", register);
router.post("/verifyToken", verifyToken, getAuth);

module.exports = router;
