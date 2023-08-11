const express = require("express");

const { register, getAuth, login, updateUser } = require("../controller/blog");
const verifyToken = require("../middleware/jwttokencheck");

const router = express.Router();

router.post("/register", register);
router.post("/verifyToken", verifyToken, getAuth);
router.post("/login", login);

router.patch("/updateUser/:id", updateUser);

module.exports = router;
