const express = require("express");

const { register, getAuth, login } = require("../controller/blog");
const verifyToken = require("../middleware/jwttokencheck");

const router = express.Router();

router.post("/register", register);
router.post("/verifyToken", verifyToken, getAuth);
router.post('/login', login)


module.exports = router;
