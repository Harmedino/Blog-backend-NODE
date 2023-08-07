const express = require("express");
const { register } = require("../controller/blog");

const router = express.Router();

router.post("/auth", register);

module.exports = router;
